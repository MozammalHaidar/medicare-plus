from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'contact_name', 'doctor', 'specialty', 'scheduled_date', 'scheduled_time', 'status', 'visit_type']
    list_filter = ['status', 'visit_type', 'specialty']
    search_fields = ['guest_name', 'guest_email', 'patient__email', 'doctor__name']
    autocomplete_fields = ['doctor', 'specialty', 'patient']
    date_hierarchy = 'scheduled_date'
    readonly_fields = ['created_at', 'updated_at']
