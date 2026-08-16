from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from apps.accounts.permissions import IsPatientOwnerOrDoctorOrAdmin

from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentStatusUpdateSerializer
from .utils import send_appointment_confirmation


class AppointmentViewSet(viewsets.ModelViewSet):
    """Booking creation is open to guests (throttled harder than normal
    traffic to deter abuse); reading/managing a specific appointment is
    restricted to its patient, its doctor, or staff.
    """

    serializer_class = AppointmentSerializer
    filterset_fields = ['status', 'visit_type', 'doctor', 'scheduled_date']
    ordering_fields = ['scheduled_date', 'scheduled_time', 'created_at']

    def get_throttles(self):
        if self.action == 'create':
            self.throttle_scope = 'appointment'
            return [ScopedRateThrottle()]
        return super().get_throttles()

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action == 'list':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsPatientOwnerOrDoctorOrAdmin()]

    def get_queryset(self):
        queryset = Appointment.objects.select_related('patient', 'doctor', 'specialty')
        user = self.request.user

        if not user.is_authenticated:
            return queryset.none()
        if user.is_staff:
            return queryset
        if getattr(user, 'role', None) == 'doctor' and hasattr(user, 'doctor_profile'):
            return queryset.filter(doctor=user.doctor_profile)
        return queryset.filter(patient=user)

    def perform_create(self, serializer):
        appointment = serializer.save()
        send_appointment_confirmation(appointment)

    @action(detail=True, methods=['patch'])
    def status_update(self, request, pk=None):
        """PATCH /appointments/{id}/status_update/ — doctor or staff
        only, moves the appointment through pending -> confirmed ->
        completed. Deliberately does NOT allow a patient to use this,
        even for their own appointment: a patient shouldn't be able to
        mark their own visit "confirmed" or "completed" — those are
        clinical/scheduling judgment calls. For a patient cancelling
        their own booking, see the `cancel` action below instead.
        """
        appointment = self.get_object()
        user = request.user
        doctor_profile = getattr(user, 'doctor_profile', None)
        is_assigned_doctor = doctor_profile is not None and doctor_profile.id == appointment.doctor_id
        if not (user.is_staff or is_assigned_doctor):
            return Response({'detail': 'Not permitted to update this appointment.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = AppointmentStatusUpdateSerializer(appointment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        send_appointment_confirmation(appointment)
        return Response(AppointmentSerializer(appointment).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """POST /appointments/{id}/cancel/ — the appointment's own
        patient, its assigned doctor, or staff may cancel it. This is
        intentionally a narrower permission than `status_update`:
        cancelling is something the patient who booked it should be
        able to do themselves (unlike confirming/completing), so it's
        its own action with its own, simpler rule — "do you own this
        booking (in any of the three ways), and is it still
        cancellable" — rather than reusing status_update's doctor/staff
        -only check.

        get_object() already enforces IsPatientOwnerOrDoctorOrAdmin at
        the object level via get_permissions(), so by the time we get
        here the requester is already known to be the owning patient,
        the assigned doctor, or staff.
        """
        appointment = self.get_object()

        if appointment.status == Appointment.Status.CANCELLED:
            return Response({'detail': 'This appointment is already cancelled.'}, status=status.HTTP_400_BAD_REQUEST)
        if appointment.status == Appointment.Status.COMPLETED:
            return Response({'detail': 'A completed appointment cannot be cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

        appointment.status = Appointment.Status.CANCELLED
        appointment.save(update_fields=['status', 'updated_at'])
        send_appointment_confirmation(appointment)
        return Response(AppointmentSerializer(appointment).data)
