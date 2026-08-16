from rest_framework import serializers
from .models import Article, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']
        read_only_fields = ['id', 'slug']


class ArticleListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.full_name', read_only=True, default=None)
    read_time_minutes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'slug', 'title', 'excerpt', 'category', 'category_name', 'author_name', 'cover_image', 'read_time_minutes', 'published_at']


class ArticleDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(source='category', queryset=Category.objects.all(), write_only=True)
    author_name = serializers.CharField(source='author.full_name', read_only=True, default=None)
    read_time_minutes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'slug', 'title', 'excerpt', 'body', 'category', 'category_id', 'author_name', 'cover_image', 'status', 'read_time_minutes', 'published_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'published_at', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
