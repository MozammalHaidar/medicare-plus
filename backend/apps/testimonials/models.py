from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Testimonial(models.Model):
    patient_name = models.CharField(max_length=150)
    role = models.CharField(max_length=150, help_text='e.g. "Patient, Cardiology"')
    quote = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)])
    image = models.ImageField(upload_to='testimonials/%Y/%m/', blank=True, null=True)
    is_featured = models.BooleanField(default=True, db_index=True)
    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f'{self.patient_name} ({self.rating}\u2605)'
