from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets
from apps.accounts.permissions import IsAdminOrReadOnly
from .models import FAQ
from .serializers import FAQSerializer


@method_decorator(cache_page(settings.CACHE_TTL), name='list')
class FAQViewSet(viewsets.ModelViewSet):
    serializer_class = FAQSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        return FAQ.objects.filter(is_active=True).order_by('order', 'id')
