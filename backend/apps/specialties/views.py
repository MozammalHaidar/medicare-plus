from django.conf import settings
from django.db.models import Count, Q
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets
from apps.accounts.permissions import IsAdminOrReadOnly
from .models import Specialty
from .serializers import SpecialtySerializer


@method_decorator(cache_page(settings.CACHE_TTL), name='list')
class SpecialtyViewSet(viewsets.ModelViewSet):
    serializer_class = SpecialtySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    search_fields = ['name', 'description']
    ordering_fields = ['name']
    filterset_fields = ['is_active']

    def get_queryset(self):
        return (
            Specialty.objects.filter(is_active=True)
            .annotate(doctor_count=Count('doctors', filter=Q(doctors__is_active=True)))
            .order_by('name')
        )
