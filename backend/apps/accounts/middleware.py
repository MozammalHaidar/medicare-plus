import logging
import time

logger = logging.getLogger('medicareplus.requests')


class RequestLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.monotonic()
        response = self.get_response(request)
        duration_ms = (time.monotonic() - start) * 1000
        if request.path.startswith('/api/'):
            logger.info('%s %s -> %s (%.1fms)', request.method, request.get_full_path(), response.status_code, duration_ms)
            response['X-Response-Time-Ms'] = f'{duration_ms:.1f}'
        return response
