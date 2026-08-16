"""
Tests for the appointment booking flow — the most business-critical
logic in the project. Covers the three guarantees the booking
serializer/view are supposed to enforce:

1. A doctor can't be double-booked for the same date+time.
2. Cancelling an appointment frees that slot back up for someone else.
3. A booking must fall within the doctor's configured working hours,
   when they have any configured.

...and the `cancel` action's permission boundary: the owning patient
can cancel their own appointment, but not someone else's.
"""

from datetime import date, timedelta

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.doctors.models import Doctor, DoctorAvailability
from apps.specialties.models import Specialty

from .models import Appointment

User = get_user_model()


def next_weekday(weekday):
    """Returns the next date (today or later) that falls on the given
    Python weekday (Monday=0..Sunday=6)."""
    today = date.today()
    days_ahead = (weekday - today.weekday()) % 7
    return today + timedelta(days=days_ahead)


class AppointmentBookingTests(APITestCase):
    def setUp(self):
        self.specialty = Specialty.objects.create(name='Cardiology')
        self.doctor = Doctor.objects.create(name='Dr. Amara Whitfield', specialty=self.specialty, is_active=True)
        # Available Mondays 9:00-13:00 only.
        DoctorAvailability.objects.create(doctor=self.doctor, weekday=0, start_time='09:00', end_time='13:00')

        self.monday = next_weekday(0)
        self.patient = User.objects.create_user(
            email='patient@test.com', password='TestPass123!', first_name='Jordan', last_name='Lee'
        )
        self.other_patient = User.objects.create_user(
            email='other@test.com', password='TestPass123!', first_name='Alex', last_name='Kim'
        )

    def _book(self, **overrides):
        payload = {
            'doctor': self.doctor.id,
            'scheduled_date': str(self.monday),
            'scheduled_time': '10:00:00',
            'visit_type': 'video',
            'guest_name': 'Guest User',
            'guest_email': 'guest@test.com',
        }
        payload.update(overrides)
        return self.client.post('/api/v1/appointments/', payload, format='json')

    def test_guest_can_book_a_valid_slot(self):
        response = self._book()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data['status'], 'pending')
        self.assertEqual(response.data['specialty_name'], 'Cardiology')

    def test_authenticated_patient_booking_is_linked_to_their_account(self):
        self.client.force_authenticate(self.patient)
        response = self._book(guest_name='', guest_email='')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        appointment = Appointment.objects.get(pk=response.data['id'])
        self.assertEqual(appointment.patient_id, self.patient.id)

    def test_double_booking_same_slot_is_rejected(self):
        first = self._book()
        self.assertEqual(first.status_code, status.HTTP_201_CREATED)

        second = self._book(guest_email='someone-else@test.com')
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cancelling_frees_the_slot_for_rebooking(self):
        first = self._book()
        appointment_id = first.data['id']

        self.client.force_authenticate(self.patient)
        Appointment.objects.filter(pk=appointment_id).update(patient=self.patient)
        cancel_response = self.client.post(f'/api/v1/appointments/{appointment_id}/cancel/')
        self.assertEqual(cancel_response.status_code, status.HTTP_200_OK, cancel_response.data)
        self.assertEqual(cancel_response.data['status'], 'cancelled')

        self.client.force_authenticate(None)
        rebook = self._book(guest_email='new-guest@test.com')
        self.assertEqual(rebook.status_code, status.HTTP_201_CREATED, rebook.data)

    def test_booking_outside_doctor_hours_is_rejected(self):
        # Doctor is only available 9:00-13:00 — 20:00 is out of range.
        response = self._book(scheduled_time='20:00:00')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_on_a_day_doctor_has_no_hours_is_rejected(self):
        # Doctor has no configured availability on Sundays at all.
        sunday = next_weekday(6)
        response = self._book(scheduled_date=str(sunday))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_without_guest_info_or_auth_is_rejected(self):
        response = self._book(guest_name='', guest_email='')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_in_the_past_is_rejected(self):
        yesterday = date.today() - timedelta(days=1)
        response = self._book(scheduled_date=str(yesterday))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AppointmentCancelPermissionTests(APITestCase):
    def setUp(self):
        specialty = Specialty.objects.create(name='Pediatrics')
        self.doctor = Doctor.objects.create(name='Dr. Naomi Chen', specialty=specialty, is_active=True)
        self.monday = next_weekday(0)

        self.owner = User.objects.create_user(email='owner@test.com', password='TestPass123!', first_name='Owner', last_name='Patient')
        self.stranger = User.objects.create_user(email='stranger@test.com', password='TestPass123!', first_name='Stranger', last_name='Danger')
        self.staff = User.objects.create_user(email='staff@test.com', password='TestPass123!', first_name='Staff', last_name='Member', is_staff=True)

        self.appointment = Appointment.objects.create(
            patient=self.owner,
            doctor=self.doctor,
            specialty=specialty,
            scheduled_date=self.monday,
            scheduled_time='10:00:00',
            status=Appointment.Status.PENDING,
        )

    def test_owner_can_cancel_their_own_appointment(self):
        self.client.force_authenticate(self.owner)
        response = self.client.post(f'/api/v1/appointments/{self.appointment.id}/cancel/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, Appointment.Status.CANCELLED)

    def test_other_patient_cannot_cancel_someone_elses_appointment(self):
        self.client.force_authenticate(self.stranger)
        response = self.client.post(f'/api/v1/appointments/{self.appointment.id}/cancel/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, Appointment.Status.PENDING)

    def test_anonymous_user_cannot_cancel(self):
        response = self.client.post(f'/api/v1/appointments/{self.appointment.id}/cancel/')
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_staff_can_cancel_any_appointment(self):
        self.client.force_authenticate(self.staff)
        response = self.client.post(f'/api/v1/appointments/{self.appointment.id}/cancel/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cannot_cancel_an_already_cancelled_appointment(self):
        self.appointment.status = Appointment.Status.CANCELLED
        self.appointment.save(update_fields=['status'])
        self.client.force_authenticate(self.owner)
        response = self.client.post(f'/api/v1/appointments/{self.appointment.id}/cancel/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_cancel_a_completed_appointment(self):
        self.appointment.status = Appointment.Status.COMPLETED
        self.appointment.save(update_fields=['status'])
        self.client.force_authenticate(self.owner)
        response = self.client.post(f'/api/v1/appointments/{self.appointment.id}/cancel/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_owner_cannot_use_status_update_to_confirm_their_own_appointment(self):
        """status_update is doctor/staff-only, even for the owning patient —
        a patient shouldn't be able to mark their own visit "confirmed"."""
        self.client.force_authenticate(self.owner)
        response = self.client.patch(f'/api/v1/appointments/{self.appointment.id}/status_update/', {'status': 'confirmed'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
