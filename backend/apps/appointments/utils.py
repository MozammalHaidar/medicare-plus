import logging
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_appointment_confirmation(appointment):
    try:
        send_mail(
            subject=f'Your MediCare+ appointment is {appointment.get_status_display().lower()}',
            message=(
                f'Hi {appointment.contact_name},\n\n'
                f'Your {appointment.get_visit_type_display().lower()} with {appointment.doctor.name} '
                f'({appointment.specialty.name}) is scheduled for '
                f'{appointment.scheduled_date} at {appointment.scheduled_time}.\n\n'
                f'Status: {appointment.get_status_display()}\n\n'
                f'\u2014 {settings.SITE_NAME}'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[appointment.contact_email],
            fail_silently=False,
        )
    except Exception:
        logger.exception('Failed to send appointment confirmation email for appointment #%s', appointment.pk)
