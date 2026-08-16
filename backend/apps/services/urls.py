from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet

router = DefaultRouter()
router.register('services', ServiceViewSet, basename='service')
app_name = 'services'
urlpatterns = router.urls
