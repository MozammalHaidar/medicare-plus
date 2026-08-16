from django.db.models import Avg, Count
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from .models import Doctor, Review


def _recalculate_rating(doctor_id):
    stats = Review.objects.filter(doctor_id=doctor_id).aggregate(avg=Avg('rating'), count=Count('id'))
    Doctor.objects.filter(pk=doctor_id).update(rating_avg=stats['avg'] or 0, rating_count=stats['count'] or 0)


@receiver(post_save, sender=Review)
def review_saved(sender, instance, **kwargs):
    _recalculate_rating(instance.doctor_id)


@receiver(post_delete, sender=Review)
def review_deleted(sender, instance, **kwargs):
    _recalculate_rating(instance.doctor_id)
