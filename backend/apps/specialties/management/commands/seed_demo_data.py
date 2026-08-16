from datetime import time

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.blog.models import Article, Category
from apps.doctors.models import Doctor, DoctorAvailability
from apps.faq.models import FAQ
from apps.services.models import Service
from apps.specialties.models import Specialty
from apps.testimonials.models import Testimonial

SPECIALTIES = [
    ('Cardiology', 'HiOutlineHeart', 'Heart health screening, rhythm disorders, and long-term cardiac care.'),
    ('Neurology', 'HiOutlineCpuChip', 'Diagnosis and treatment for the brain, spine, and nervous system.'),
    ('Pediatrics', 'HiOutlineFaceSmile', 'Compassionate care for infants, children, and adolescents.'),
    ('Orthopedics', 'HiOutlineHandRaised', 'Joint, bone, and muscle treatment from sprains to surgery.'),
    ('Dermatology', 'HiOutlineSparkles', 'Skin, hair, and nail care for every age and condition.'),
    ('Dentistry', 'HiOutlineShieldCheck', 'Preventive, cosmetic, and restorative dental treatment.'),
    ('Gynecology', 'HiOutlineSun', "Full-spectrum women's health, from wellness to maternity."),
    ('Oncology', 'HiOutlineBeaker', 'Cancer screening, treatment planning, and survivorship support.'),
]

SERVICES = [
    ('Telemedicine Visits', 'HiOutlineVideoCamera', 'Secure video consultations with licensed physicians from anywhere.'),
    ('Instant Appointment Booking', 'HiOutlineCalendarDays', 'Real-time availability across every specialty, booked in under a minute.'),
    ('Digital Health Records', 'HiOutlineClipboardDocumentCheck', 'Your history, prescriptions, and results organized in one secure place.'),
    ('At-Home Care', 'HiOutlineTruck', 'Nurse visits and diagnostics dispatched directly to your door.'),
    ('Lab & Diagnostics', 'HiOutlineBeaker', 'Same-day sample collection with results delivered straight to your app.'),
    ('24/7 Care Line', 'HiOutlinePhone', 'Round-the-clock triage support whenever a question cannot wait.'),
]

DOCTORS = [
    ('Dr. Amara Whitfield', 'Cardiology', 14, 285),
    ('Dr. Rajiv Malhotra', 'Neurology', 11, 225),
    ('Dr. Naomi Chen', 'Pediatrics', 9, 165),
    ('Dr. Elias Bergman', 'Orthopedics', 17, 240),
    ('Dr. Priya Nair', 'Dermatology', 8, 150),
    ('Dr. Marcus Webb', 'Dentistry', 13, 130),
    ('Dr. Sofia Ibarra', 'Gynecology', 12, 195),
    ('Dr. Daniel Osei', 'Oncology', 19, 310),
]

FAQS = [
    ('How quickly can I get an appointment?',
     'Most specialties offer same-day video consultations, and in-person visits are typically available within 48 hours depending on your location.'),
    ('Is my health data kept private?',
     'Yes. All records are encrypted end-to-end and stored in compliance with HIPAA. Only you and your care team can access your history.'),
    ('Do you accept insurance?',
     'MediCare+ partners with most major insurance providers. You can check your coverage during checkout before confirming any appointment.'),
    ('Can I switch doctors after booking?',
     'Absolutely. You can reschedule or reassign your appointment to another available doctor at any time before your visit, at no extra cost.'),
    ('What happens during an at-home visit?',
     'A licensed nurse arrives with mobile diagnostic equipment, performs the requested checkup or sample collection, and results sync to your account automatically.'),
]

TESTIMONIALS = [
    ('Helena Trask', 'Patient, Cardiology', 5,
     'Booking a cardiology visit used to take weeks. Here I had a same-day video consult and a clear follow-up plan within the hour.'),
    ('Marcus Feld', 'Patient, Orthopedics', 5,
     'The at-home care team handled my post-surgery checkups. I never had to leave the house during recovery.'),
    ('Priya Anand', 'Parent, Pediatrics', 4,
     "Our pediatrician remembers every detail of my daughter's history. The digital records make every visit faster."),
    ('Devon Okafor', 'Patient, Dermatology', 5,
     'From booking to diagnosis to prescription pickup, the whole process felt considered and unhurried.'),
]

BLOG_ARTICLES = [
    ('Cardiology', 'How to Actually Read Your Blood Pressure Numbers',
     'Systolic, diastolic, and what the gap between them tells your doctor before you even sit down.'),
    ('Pediatrics', 'The Pediatric Vaccine Schedule, Explained Simply',
     'A plain-language walkthrough of what each visit covers and why timing matters.'),
    ('Dermatology', 'The Overlooked Link Between Sleep and Skin Health',
     'Dermatologists explain what happens to your skin barrier after a poor night of rest.'),
    ('Orthopedics', 'What Recovery Really Looks Like After Joint Surgery',
     'A realistic week-by-week guide, from the first walk to full mobility.'),
]

WEEKDAY_SLOTS = [(0, time(9, 0), time(13, 0)), (2, time(9, 0), time(13, 0)), (4, time(13, 0), time(17, 0))]


class Command(BaseCommand):
    help = 'Seeds the database with realistic demo content matching the frontend mock data.'

    @transaction.atomic
    def handle(self, *args, **options):
        specialty_map = {}
        for name, icon_key, description in SPECIALTIES:
            specialty, _ = Specialty.objects.update_or_create(
                name=name, defaults={'icon_key': icon_key, 'description': description}
            )
            specialty_map[name] = specialty
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(SPECIALTIES)} specialties'))

        for i, (title, icon_key, description) in enumerate(SERVICES):
            Service.objects.update_or_create(
                title=title, defaults={'icon_key': icon_key, 'description': description, 'order': i}
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(SERVICES)} services'))

        for name, specialty_name, experience, fee in DOCTORS:
            doctor, _ = Doctor.objects.update_or_create(
                name=name,
                defaults={
                    'specialty': specialty_map[specialty_name],
                    'experience_years': experience,
                    'consultation_fee': fee,
                    'bio': f'{name} is a board-certified {specialty_name.lower()} specialist '
                           f'with {experience} years of clinical experience.',
                    'is_active': True,
                },
            )
            for weekday, start, end in WEEKDAY_SLOTS:
                DoctorAvailability.objects.get_or_create(
                    doctor=doctor, weekday=weekday, start_time=start, end_time=end
                )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(DOCTORS)} doctors with availability'))

        for question, answer in FAQS:
            FAQ.objects.update_or_create(question=question, defaults={'answer': answer})
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(FAQS)} FAQs'))

        for i, (name, role, rating, quote) in enumerate(TESTIMONIALS):
            Testimonial.objects.update_or_create(
                patient_name=name, defaults={'role': role, 'rating': rating, 'quote': quote, 'order': i}
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(TESTIMONIALS)} testimonials'))

        for category_name, title, excerpt in BLOG_ARTICLES:
            category, _ = Category.objects.get_or_create(name=category_name)
            Article.objects.update_or_create(
                title=title,
                defaults={
                    'category': category,
                    'excerpt': excerpt,
                    'body': excerpt + '\n\n' + (
                        'This overview reflects general guidance shared by clinicians on the MediCare+ '
                        'platform. It is intended to help you prepare thoughtful questions for your next '
                        'visit, not to replace a diagnosis.'
                    ),
                    'status': Article.Status.PUBLISHED,
                },
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(BLOG_ARTICLES)} blog articles'))

        self.stdout.write(self.style.SUCCESS('Demo data seed complete.'))
