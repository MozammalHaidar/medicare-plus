import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/SectionTitle/SectionTitle';
import ServiceCard from '../components/ServiceCard/ServiceCard';
import { ServiceCardSkeleton } from '../components/shared/Skeleton';
import ApiErrorState from '../components/shared/ApiErrorState';
import CTA from '../components/CTA/CTA';
import { useApiList } from '../hooks/useApi';

const Services = () => {
  const { data: services, loading, error } = useApiList('/services/');

  return (
    <>
      <PageHero
        eyebrow="What We Offer"
        title="Healthcare services built for real life"
        description="From a two-minute video call to full at-home diagnostics — pick the level of care that fits today."
      />
      <section className="container-app py-16">
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        )}
        {!loading && error && <ApiErrorState message="Couldn't load services right now." />}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white py-16 dark:bg-darksurface-raised">
        <div className="container-app">
          <SectionTitle
            eyebrow="Why MediCare+"
            title="One platform, coordinated care"
            description="Every service shares the same medical record, so your care team is always looking at the full picture."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { title: 'Unified Records', text: 'Every visit, prescription, and lab result lives in one secure profile.' },
              { title: 'Verified Physicians', text: 'Every doctor on the platform is licensed, credentialed, and reviewed.' },
              { title: 'Transparent Pricing', text: 'See costs upfront, with insurance coverage checked before you book.' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl2 border border-primary-100/60 bg-surface-muted p-6 dark:border-white/10 dark:bg-darksurface-card">
                <h3 className="font-display text-base font-bold text-ink dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-white/50">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-20">
        <CTA />
      </div>
    </>
  );
};

export default Services;
