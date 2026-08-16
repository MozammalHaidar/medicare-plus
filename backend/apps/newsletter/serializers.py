from rest_framework import serializers
from .models import Subscriber


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ['id', 'email', 'subscribed_at']
        read_only_fields = ['id', 'subscribed_at']

    def validate_email(self, value):
        value = value.lower().strip()
        existing = Subscriber.objects.filter(email__iexact=value).first()
        if existing and existing.is_active:
            raise serializers.ValidationError("You're already subscribed with this email.")
        return value

    def create(self, validated_data):
        subscriber, _ = Subscriber.objects.update_or_create(email=validated_data['email'], defaults={'is_active': True})
        return subscriber
