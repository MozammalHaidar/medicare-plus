from rest_framework.routers import DefaultRouter
from .views import TestimonialViewSet

router = DefaultRouter()
router.register('testimonials', TestimonialViewSet, basename='testimonial')
app_name = 'testimonials'
urlpatterns = router.urls
