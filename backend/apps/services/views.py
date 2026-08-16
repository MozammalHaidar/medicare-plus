from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets
from apps.accounts.permissions import IsAdminOrReadOnly
from .models import Service
from .serializers import ServiceSerializer


@method_decorator(cache_page(settings.CACHE_TTL), name='list')
class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ['title', 'description']
    ordering_fields = ['order', 'title']

    def get_queryset(self):
        return Service.objects.filter(is_active=True).order_by('order', 'title')
