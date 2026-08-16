from rest_framework import mixins, permissions, viewsets
from rest_framework.throttling import ScopedRateThrottle
from .models import ContactMessage
from .serializers import ContactMessageSerializer
from .utils import notify_admin_of_contact_message


class ContactMessageViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = ContactMessageSerializer
    queryset = ContactMessage.objects.all()
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact'

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        contact_message = serializer.save()
        notify_admin_of_contact_message(contact_message)
