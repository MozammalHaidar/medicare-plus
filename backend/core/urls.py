from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def health_check(request):
    return JsonResponse({'status': 'ok', 'service': settings.SITE_NAME})


api_v1_patterns = [
    path('', include('apps.accounts.urls')),
    path('', include('apps.specialties.urls')),
    path('', include('apps.doctors.urls')),
    path('', include('apps.services.urls')),
    path('', include('apps.appointments.urls')),
    path('', include('apps.testimonials.urls')),
    path('', include('apps.blog.urls')),
    path('', include('apps.faq.urls')),
    path('', include('apps.contact.urls')),
    path('', include('apps.newsletter.urls')),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_v1_patterns)),
    path('health/', health_check, name='health-check'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
