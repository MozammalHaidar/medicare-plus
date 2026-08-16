from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.accounts.permissions import IsAdminOrReadOnly
from .models import Article, Category
from .serializers import ArticleDetailSerializer, ArticleListSerializer, CategorySerializer


@method_decorator(cache_page(settings.CACHE_TTL), name='list')
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


@method_decorator(cache_page(settings.CACHE_TTL), name='list')
class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filterset_fields = ['category__slug']
    search_fields = ['title', 'excerpt', 'body']
    ordering_fields = ['published_at', 'title']

    def get_queryset(self):
        queryset = Article.objects.select_related('category', 'author')
        if self.action == 'list':
            return queryset.filter(status=Article.Status.PUBLISHED)
        if self.action == 'retrieve' and not (self.request.user and self.request.user.is_staff):
            return queryset.filter(status=Article.Status.PUBLISHED)
        return queryset

    def get_serializer_class(self):
        return ArticleDetailSerializer if self.action == 'retrieve' else ArticleListSerializer

    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        article = self.get_object()
        related = Article.objects.filter(category=article.category, status=Article.Status.PUBLISHED).exclude(pk=article.pk).select_related('category')[:3]
        return Response(ArticleListSerializer(related, many=True).data)
