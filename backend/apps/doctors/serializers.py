from rest_framework import serializers
from apps.specialties.serializers import SpecialtySerializer
from .models import Doctor, DoctorAvailability, Review


class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    weekday_display = serializers.CharField(source='get_weekday_display', read_only=True)

    class Meta:
        model = DoctorAvailability
        fields = ['id', 'weekday', 'weekday_display', 'start_time', 'end_time']

    def validate(self, attrs):
        start = attrs.get('start_time', getattr(self.instance, 'start_time', None))
        end = attrs.get('end_time', getattr(self.instance, 'end_time', None))
        if start and end and end <= start:
            raise serializers.ValidationError('end_time must be after start_time.')
        return attrs


class ReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'doctor', 'patient', 'patient_name', 'appointment', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'patient', 'patient_name', 'created_at']

    def validate_appointment(self, appointment):
        request = self.context['request']
        if appointment is None:
            return appointment
        if appointment.patient_id != request.user.id:
            raise serializers.ValidationError('You can only review your own appointments.')
        if appointment.status != appointment.Status.COMPLETED:
            raise serializers.ValidationError('You can only review a completed appointment.')
        return appointment

    def create(self, validated_data):
        validated_data['patient'] = self.context['request'].user
        return super().create(validated_data)


class DoctorListSerializer(serializers.ModelSerializer):
    specialty_name = serializers.CharField(source='specialty.name', read_only=True)
    specialty_slug = serializers.CharField(source='specialty.slug', read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'slug', 'name', 'specialty', 'specialty_name', 'specialty_slug', 'experience_years', 'consultation_fee', 'image', 'rating_avg', 'rating_count', 'is_active']


class DoctorDetailSerializer(serializers.ModelSerializer):
    specialty = SpecialtySerializer(read_only=True)
    specialty_id = serializers.PrimaryKeyRelatedField(source='specialty', queryset=Doctor._meta.get_field('specialty').related_model.objects.all(), write_only=True)
    availability_slots = DoctorAvailabilitySerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'slug', 'name', 'specialty', 'specialty_id', 'bio', 'experience_years', 'consultation_fee', 'image', 'is_active', 'rating_avg', 'rating_count', 'availability_slots', 'reviews', 'created_at']
        read_only_fields = ['id', 'slug', 'rating_avg', 'rating_count', 'created_at']
