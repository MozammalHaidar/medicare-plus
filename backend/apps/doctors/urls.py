from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, ReviewViewSet

router = DefaultRouter()
router.register('doctors', DoctorViewSet, basename='doctor')
router.register('reviews', ReviewViewSet, basename='review')
app_name = 'doctors'
urlpatterns = router.urls
