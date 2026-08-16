from rest_framework import serializers
from .models import Specialty


class SpecialtySerializer(serializers.ModelSerializer):
    doctor_count = serializers.SerializerMethodField()

    class Meta:
        model = Specialty
        fields = ['id', 'name', 'slug', 'description', 'icon_key', 'is_active', 'doctor_count']
        read_only_fields = ['id', 'slug']

    def get_doctor_count(self, obj) -> int:
        annotated = getattr(obj, 'doctor_count', None)
        if annotated is not None:
            return annotated
        return obj.doctors.filter(is_active=True).count()
