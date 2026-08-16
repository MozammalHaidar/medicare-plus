from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters import rest_framework as filters
from rest_framework import permissions, viewsets
from apps.accounts.permissions import IsAdminOrReadOnly
from .models import Doctor, Review
from .serializers import DoctorDetailSerializer, DoctorListSerializer, ReviewSerializer


class DoctorFilter(filters.FilterSet):
    specialty = filters.CharFilter(field_name='specialty__slug', lookup_expr='iexact')
    min_experience = filters.NumberFilter(field_name='experience_years', lookup_expr='gte')
    min_rating = filters.NumberFilter(field_name='rating_avg', lookup_expr='gte')

    class Meta:
        model = Doctor
        fields = ['specialty', 'min_experience', 'min_rating']


@method_decorator(cache_page(settings.CACHE_TTL), name='list')
class DoctorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filterset_class = DoctorFilter
    search_fields = ['name', 'specialty__name', 'bio']
    ordering_fields = ['rating_avg', 'experience_years', 'consultation_fee', 'name']

    def get_queryset(self):
        queryset = Doctor.objects.filter(is_active=True).select_related('specialty')
        if self.action == 'retrieve':
            queryset = queryset.prefetch_related('availability_slots', 'reviews__patient')
        return queryset

    def get_serializer_class(self):
        return DoctorDetailSerializer if self.action == 'retrieve' else DoctorListSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Review.objects.select_related('patient', 'doctor')
        doctor_slug = self.request.query_params.get('doctor')
        if doctor_slug:
            queryset = queryset.filter(doctor__slug=doctor_slug)
        return queryset

    def get_object(self):
        obj = super().get_object()
        if self.action in ('update', 'partial_update', 'destroy') and obj.patient_id != self.request.user.id:
            self.permission_denied(self.request, message='You can only manage your own reviews.')
        return obj
