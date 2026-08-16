from decimal import Decimal
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify


class Doctor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='doctor_profile')
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    specialty = models.ForeignKey('specialties.Specialty', on_delete=models.PROTECT, related_name='doctors')
    bio = models.TextField(blank=True)
    experience_years = models.PositiveSmallIntegerField(default=0)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
    image = models.ImageField(upload_to='doctors/%Y/%m/', blank=True, null=True)
    is_active = models.BooleanField(default=True, db_index=True)
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=Decimal('0.00'))
    rating_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating_avg', 'name']
        indexes = [models.Index(fields=['specialty', 'is_active']), models.Index(fields=['-rating_avg'])]

    def __str__(self):
        return f'Dr. {self.name} ({self.specialty})'

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            i = 1
            while Doctor.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                i += 1
                slug = f'{base_slug}-{i}'
            self.slug = slug
        super().save(*args, **kwargs)


class DoctorAvailability(models.Model):
    class Weekday(models.IntegerChoices):
        MONDAY = 0, 'Monday'; TUESDAY = 1, 'Tuesday'; WEDNESDAY = 2, 'Wednesday'
        THURSDAY = 3, 'Thursday'; FRIDAY = 4, 'Friday'; SATURDAY = 5, 'Saturday'; SUNDAY = 6, 'Sunday'

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='availability_slots')
    weekday = models.IntegerField(choices=Weekday.choices)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        verbose_name_plural = 'doctor availability'
        ordering = ['weekday', 'start_time']
        constraints = [models.CheckConstraint(condition=models.Q(end_time__gt=models.F('start_time')), name='availability_end_after_start')]

    def __str__(self):
        return f'{self.doctor.name}: {self.get_weekday_display()} {self.start_time}-{self.end_time}'


class Review(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='reviews')
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews_written')
    appointment = models.ForeignKey('appointments.Appointment', on_delete=models.SET_NULL, null=True, blank=True, related_name='review')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [models.UniqueConstraint(fields=['doctor', 'patient', 'appointment'], name='one_review_per_appointment')]

    def __str__(self):
        return f'{self.rating}\u2605 for {self.doctor.name} by {self.patient.email}'
