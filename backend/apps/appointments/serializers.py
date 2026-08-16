from datetime import date
from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    specialty_name = serializers.CharField(source='specialty.name', read_only=True)
    contact_name = serializers.CharField(read_only=True)
    contact_email = serializers.CharField(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'guest_name', 'guest_email', 'guest_phone',
            'contact_name', 'contact_email', 'doctor', 'doctor_name', 'specialty', 'specialty_name',
            'visit_type', 'status', 'scheduled_date', 'scheduled_time', 'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'patient', 'specialty', 'status', 'created_at', 'updated_at']

    def validate_scheduled_date(self, value):
        if value < date.today():
            raise serializers.ValidationError('Appointment date cannot be in the past.')
        return value

    def validate_doctor(self, doctor):
        if not doctor.is_active:
            raise serializers.ValidationError('This doctor is not currently accepting appointments.')
        return doctor

    def validate(self, attrs):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        is_authenticated = bool(user and user.is_authenticated)

        if not is_authenticated and not (attrs.get('guest_name') and attrs.get('guest_email')):
            raise serializers.ValidationError('guest_name and guest_email are required when booking without an account.')

        doctor = attrs.get('doctor') or getattr(self.instance, 'doctor', None)
        scheduled_date = attrs.get('scheduled_date') or getattr(self.instance, 'scheduled_date', None)
        scheduled_time = attrs.get('scheduled_time') or getattr(self.instance, 'scheduled_time', None)

        if doctor and scheduled_date and scheduled_time:
            weekday = scheduled_date.weekday()
            slot_match = doctor.availability_slots.filter(weekday=weekday, start_time__lte=scheduled_time, end_time__gt=scheduled_time).exists()
            if doctor.availability_slots.exists() and not slot_match:
                raise serializers.ValidationError("Selected time falls outside this doctor's available hours for that day.")

            clashing = Appointment.objects.filter(doctor=doctor, scheduled_date=scheduled_date, scheduled_time=scheduled_time).exclude(status=Appointment.Status.CANCELLED)
            if self.instance:
                clashing = clashing.exclude(pk=self.instance.pk)
            if clashing.exists():
                raise serializers.ValidationError('This time slot was just booked \u2014 please pick another.')

        if doctor:
            attrs['specialty'] = doctor.specialty

        return attrs

    def create(self, validated_data):
        request = self.context['request']
        if request.user.is_authenticated:
            validated_data['patient'] = request.user
        return super().create(validated_data)


class AppointmentStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['status']
