from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class Appointment(models.Model):
    class VisitType(models.TextChoices):
        VIDEO = 'video', 'Video Visit'
        IN_PERSON = 'inperson', 'In-Person'
        AT_HOME = 'athome', 'At-Home'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    guest_name = models.CharField(max_length=150, blank=True)
    guest_email = models.EmailField(blank=True)
    guest_phone = models.CharField(max_length=20, blank=True)
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.PROTECT, related_name='appointments')
    specialty = models.ForeignKey('specialties.Specialty', on_delete=models.PROTECT, related_name='appointments')
    visit_type = models.CharField(max_length=10, choices=VisitType.choices, default=VisitType.VIDEO)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING, db_index=True)
    scheduled_date = models.DateField(db_index=True)
    scheduled_time = models.TimeField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-scheduled_date', '-scheduled_time']
        indexes = [models.Index(fields=['doctor', 'scheduled_date']), models.Index(fields=['status', 'scheduled_date'])]
        constraints = [
            models.UniqueConstraint(
                fields=['doctor', 'scheduled_date', 'scheduled_time'],
                condition=~models.Q(status='cancelled'),
                name='unique_active_doctor_slot',
            ),
        ]

    def __str__(self):
        who = self.patient.full_name if self.patient_id else (self.guest_name or 'Guest')
        return f'{who} with {self.doctor.name} on {self.scheduled_date} {self.scheduled_time}'

    def clean(self):
        if not self.patient_id and not (self.guest_name and self.guest_email):
            raise ValidationError('Either a logged-in patient or guest name + email is required.')

    @property
    def contact_email(self):
        return self.patient.email if self.patient_id else self.guest_email

    @property
    def contact_name(self):
        return self.patient.full_name if self.patient_id else self.guest_name
