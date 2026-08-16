from rest_framework.routers import DefaultRouter
from .views import FAQViewSet

router = DefaultRouter()
router.register('faqs', FAQViewSet, basename='faq')
app_name = 'faq'
urlpatterns = router.urls
