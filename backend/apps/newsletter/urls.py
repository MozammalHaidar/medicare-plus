from rest_framework.routers import DefaultRouter
from .views import SubscriberViewSet

router = DefaultRouter()
router.register('newsletter', SubscriberViewSet, basename='newsletter-subscriber')
app_name = 'newsletter'
urlpatterns = router.urls
