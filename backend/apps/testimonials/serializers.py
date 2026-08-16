from rest_framework import serializers
from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'patient_name', 'role', 'quote', 'rating', 'image', 'is_featured', 'order']
        read_only_fields = ['id']
