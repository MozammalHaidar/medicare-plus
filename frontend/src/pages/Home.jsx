import Hero from '../components/Hero/Hero';
import Stats from '../components/Stats/Stats';
import SectionTitle from '../components/SectionTitle/SectionTitle';
import SpecialtyCard from '../components/SpecialtyCard/SpecialtyCard';
import DoctorCard from '../components/DoctorCard/DoctorCard';
import ServiceCard from '../components/ServiceCard/ServiceCard';
import AppointmentCard from '../components/AppointmentCard/AppointmentCard';
import TestimonialCard from '../components/TestimonialCard/TestimonialCard';
import BlogCard from '../components/BlogCard/BlogCard';
import FAQ from '../components/FAQ/FAQ';
import CTA from '../components/CTA/CTA';
import Newsletter from '../components/shared/Newsletter';
import Button from '../components/Button/Button';
import { SpecialtyCardSkeleton, DoctorCardSkeleton, ServiceCardSkeleton, BlogCardSkeleton } from '../components/shared/Skeleton';
import ApiErrorState from '../components/shared/ApiErrorState';
import { useApiList } from '../hooks/useApi';
import { HiOutlineArrowRight } from 'react-icons/hi2';

const APPOINTMENT_STEPS = [
  { number: 1, title: 'Choose a Specialty', description: 'Tell us what you need — from a routine checkup to a specialist consult.' },
  { number: 2, title: 'Pick Your Doctor', description: 'Compare ratings, experience, and real-time availability.' },
  { number: 3, title: 'Select a Time', description: 'Book an in-person, video, or at-home visit that fits your schedule.' },
  { number: 4, title: 'Get Confirmed', description: 'Receive instant confirmation and reminders before your visit.' },
];

const PARTNERS = ['Cleveland Health', 'Apollo Group', 'Meridian Care', 'Northshore Clinics', 'Bright Insurance', 'Unity Health Plans'];

const Home = () => {
  const { data: specialties, loading: specialtiesLoading, error: specialtiesError } = useApiList('/specialties/');
  const { data: doctors, loading: doctorsLoading, error: doctorsError } = useApiList('/doctors/', { ordering: '-rating_avg' });
  const { data: services, loading: servicesLoading, error: servicesError } = useApiList('/services/');
  const { data: articles, loading: articlesLoading, error: articlesError } = useApiList('/blog/', { ordering: '-published_at' });

  return (
    <>
      <Hero />
      <Stats />

      {/* Trusted Partners */}
      <section className="container-app py-16">
        <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-ink-soft dark:text-white/40">
          Trusted by leading hospitals & insurance partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70 grayscale">
          {PARTNERS.map((name) => (
            <span key={name} className="font-display text-lg font-bold text-ink-soft dark:text-white/40">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section className="container-app py-16">
        <SectionTitle
          eyebrow="Medical Specialties"
          title="Every specialty, one platform"
          description="From routine checkups to complex care, find the right specialist across our core departments."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {specialtiesLoading &&
            Array.from({ length: 8 }).map((_, i) => <SpecialtyCardSkeleton key={i} />)}
          {!specialtiesLoading && specialtiesError && (
            <div className="sm:col-span-2 lg:col-span-4">
              <ApiErrorState message="Couldn't load specialties right now." />
            </div>
          )}
          {!specialtiesLoading &&
            !specialtiesError &&
            specialties.map((specialty, i) => (
              <SpecialtyCard key={specialty.id} specialty={specialty} index={i} />
            ))}
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="bg-white py-16 dark:bg-darksurface-raised">
        <div className="container-app">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <SectionTitle align="left" eyebrow="Featured Doctors" title="Meet a few of our top-rated physicians" />
            <Button to="/doctors" variant="secondary" icon={HiOutlineArrowRight}>
              View All Doctors
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {doctorsLoading && Array.from({ length: 4 }).map((_, i) => <DoctorCardSkeleton key={i} />)}
            {!doctorsLoading && doctorsError && (
              <div className="sm:col-span-2 lg:col-span-4">
                <ApiErrorState message="Couldn't load doctors right now." />
              </div>
            )}
            {!doctorsLoading &&
              !doctorsError &&
              doctors.slice(0, 4).map((doctor, i) => <DoctorCard key={doctor.id} doctor={doctor} index={i} />)}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-app py-16">
        <SectionTitle
          eyebrow="Healthcare Services"
          title="Care built around your life"
          description="Whether you need a five-minute video call or a full diagnostic workup, we bring the clinic to you."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesLoading && Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          {!servicesLoading && servicesError && (
            <div className="sm:col-span-2 lg:col-span-3">
              <ApiErrorState message="Couldn't load services right now." />
            </div>
          )}
          {!servicesLoading &&
            !servicesError &&
            services.map((service, i) => <ServiceCard key={service.id} service={service} index={i} />)}
        </div>
      </section>

      {/* Appointment Process */}
      <section className="bg-white py-16 dark:bg-darksurface-raised">
        <div className="container-app">
          <SectionTitle eyebrow="How It Works" title="Booking care takes four simple steps" />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {APPOINTMENT_STEPS.map((step, i) => (
              <AppointmentCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-app py-16">
        <SectionTitle eyebrow="Patient Stories" title="Care people actually talk about" />
        <div className="mt-12">
          <TestimonialCard />
        </div>
      </section>

      {/* Blog */}
      <section className="bg-white py-16 dark:bg-darksurface-raised">
        <div className="container-app">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <SectionTitle align="left" eyebrow="From the Journal" title="Latest medical articles" />
            <Button to="/blog" variant="secondary" icon={HiOutlineArrowRight}>
              Visit the Blog
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articlesLoading && Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)}
            {!articlesLoading && articlesError && (
              <div className="sm:col-span-2 lg:col-span-3">
                <ApiErrorState message="Couldn't load articles right now." />
              </div>
            )}
            {!articlesLoading &&
              !articlesError &&
              articles.slice(0, 3).map((article, i) => <BlogCard key={article.id} article={article} index={i} />)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-app py-16">
        <SectionTitle eyebrow="FAQ" title="Answers before you ask" />
        <div className="mt-12">
          <FAQ />
        </div>
      </section>

      <div className="py-4">
        <Newsletter />
      </div>

      <div className="py-16">
        <CTA />
      </div>
    </>
  );
};

export default Home;
