from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['patient_name', 'role', 'rating', 'is_featured', 'order']
    list_editable = ['order', 'is_featured']
    list_filter = ['is_featured', 'rating']
    search_fields = ['patient_name', 'quote']
