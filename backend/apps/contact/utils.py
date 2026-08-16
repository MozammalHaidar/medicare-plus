import logging
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def notify_admin_of_contact_message(contact_message):
    try:
        send_mail(
            subject=f'[MediCare+ Contact] {contact_message.subject}',
            message=f'From: {contact_message.name} <{contact_message.email}>\n\n{contact_message.message}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_NOTIFICATION_EMAIL],
            fail_silently=False,
        )
    except Exception:
        logger.exception('Failed to send contact notification for message #%s', contact_message.pk)
