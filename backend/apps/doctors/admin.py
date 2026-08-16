from django.contrib import admin
from .models import Doctor, DoctorAvailability, Review


class DoctorAvailabilityInline(admin.TabularInline):
    model = DoctorAvailability
    extra = 1


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialty', 'experience_years', 'rating_avg', 'rating_count', 'is_active']
    list_filter = ['specialty', 'is_active']
    search_fields = ['name', 'bio']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['rating_avg', 'rating_count', 'created_at', 'updated_at']
    inlines = [DoctorAvailabilityInline]
    autocomplete_fields = ['specialty']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['doctor', 'patient', 'rating', 'created_at']
    list_filter = ['rating']
    search_fields = ['doctor__name', 'patient__email', 'comment']
