from rest_framework import mixins, permissions, viewsets
from rest_framework.throttling import ScopedRateThrottle
from .models import Subscriber
from .serializers import SubscriberSerializer


class SubscriberViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = SubscriberSerializer
    queryset = Subscriber.objects.all()
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'newsletter'
