from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'slug', 'description', 'icon_key', 'order', 'is_active']
        read_only_fields = ['id', 'slug']
