from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, CategoryViewSet

router = DefaultRouter()
router.register('blog/categories', CategoryViewSet, basename='blog-category')
router.register('blog', ArticleViewSet, basename='article')
app_name = 'blog'
urlpatterns = router.urls
