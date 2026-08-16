from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet

router = DefaultRouter()
router.register('appointments', AppointmentViewSet, basename='appointment')
app_name = 'appointments'
urlpatterns = router.urls
