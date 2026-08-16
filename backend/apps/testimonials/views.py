from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets
from apps.accounts.permissions import IsAdminOrReadOnly
from .models import Testimonial
from .serializers import TestimonialSerializer


@method_decorator(cache_page(settings.CACHE_TTL), name='list')
class TestimonialViewSet(viewsets.ModelViewSet):
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]
    ordering_fields = ['order', 'created_at']

    def get_queryset(self):
        return Testimonial.objects.filter(is_featured=True).order_by('order', '-created_at')
