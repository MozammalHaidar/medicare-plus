import logging
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        logger.exception('Unhandled exception in %s', context.get('view'))
        return None
    detail = response.data.get('detail') if isinstance(response.data, dict) else None
    response.data = {
        'detail': detail or 'Request failed. See `errors` for details.',
        'errors': response.data,
        'status_code': response.status_code,
    }
    return response
