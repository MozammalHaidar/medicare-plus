import PageHero from '../components/shared/PageHero';
import SpecialtyCard from '../components/SpecialtyCard/SpecialtyCard';
import { SpecialtyCardSkeleton } from '../components/shared/Skeleton';
import ApiErrorState from '../components/shared/ApiErrorState';
import CTA from '../components/CTA/CTA';
import { useApiList } from '../hooks/useApi';

const Specialties = () => {
  const { data: specialties, loading, error } = useApiList('/specialties/');

  return (
    <>
      <PageHero
        eyebrow="Departments"
        title="Medical specialties we cover"
        description="Every department is staffed by board-certified physicians with real-time availability."
      />
      <section className="container-app py-16">
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SpecialtyCardSkeleton key={i} />
            ))}
          </div>
        )}
        {!loading && error && <ApiErrorState message="Couldn't load specialties right now." />}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {specialties.map((specialty, i) => (
              <SpecialtyCard key={specialty.id} specialty={specialty} index={i} />
            ))}
          </div>
        )}
      </section>
      <div className="pb-20">
        <CTA
          title="Not sure which specialist you need?"
          description="Our care coordinators can point you in the right direction in under two minutes."
          primaryLabel="Talk to a Coordinator"
          primaryTo="/contact"
          secondaryLabel="Browse Doctors"
          secondaryTo="/doctors"
        />
      </div>
    </>
  );
};

export default Specialties;
