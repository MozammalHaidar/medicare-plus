import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel } from 'react-icons/hi2';
import PageHero from '../components/shared/PageHero';
import DoctorCard from '../components/DoctorCard/DoctorCard';
import { DoctorCardSkeleton } from '../components/shared/Skeleton';
import ApiErrorState from '../components/shared/ApiErrorState';
import { useApiList } from '../hooks/useApi';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeSpecialty, setActiveSpecialty] = useState(searchParams.get('specialty') || 'all');

  const debouncedQuery = useDebouncedValue(query, 350);

  const { data: specialties } = useApiList('/specialties/');
  const { data: doctors, loading, error } = useApiList('/doctors/', {
    search: debouncedQuery || undefined,
    specialty: activeSpecialty === 'all' ? undefined : activeSpecialty,
    ordering: '-rating_avg',
  });

  useEffect(() => {
    const params = {};
    if (debouncedQuery) params.q = debouncedQuery;
    if (activeSpecialty !== 'all') params.specialty = activeSpecialty;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, activeSpecialty]);

  return (
    <>
      <PageHero
        eyebrow="Our Physicians"
        title="Find the right doctor for you"
        description="Filter by specialty or search by name to compare experience, ratings, and availability."
      />

      <section className="container-app py-16">
        <div className="flex flex-col gap-4 rounded-xl2 bg-white p-5 shadow-soft dark:bg-darksurface-card sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/60" />
            <label htmlFor="doctor-search" className="sr-only">Search doctors</label>
            <input
              id="doctor-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or specialty..."
              className="w-full rounded-full border border-primary-100 bg-surface-muted py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-soft/50 focus:border-teal-400 dark:border-white/10 dark:bg-darksurface dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft dark:text-white/50">
            <HiOutlineFunnel /> {loading ? '...' : doctors.length} result{doctors.length !== 1 && 's'}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSpecialty('all')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeSpecialty === 'all'
                ? 'bg-grad-primary text-white'
                : 'bg-white text-ink-soft hover:text-teal-600 dark:bg-darksurface-card dark:text-white/60'
            }`}
          >
            All Specialties
          </button>
          {specialties.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSpecialty(s.slug)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeSpecialty === s.slug
                  ? 'bg-grad-primary text-white'
                  : 'bg-white text-ink-soft hover:text-teal-600 dark:bg-darksurface-card dark:text-white/60'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-10">
            <ApiErrorState message="Couldn't load doctors right now." />
          </div>
        )}

        {!loading && !error && doctors.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doctor, i) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={i} />
            ))}
          </div>
        )}

        {!loading && !error && doctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 flex flex-col items-center gap-2 text-center"
          >
            <p className="font-display text-lg font-bold text-ink dark:text-white">No doctors match your search</p>
            <p className="text-sm text-ink-soft dark:text-white/50">Try a different name or clear the specialty filter.</p>
          </motion.div>
        )}
      </section>
    </>
  );
};

export default Doctors;
