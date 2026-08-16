import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCalendarDays, HiOutlinePlusCircle } from 'react-icons/hi2';
import PageHero from '../components/shared/PageHero';
import AppointmentDashboardCard from '../components/shared/AppointmentDashboardCard';
import Skeleton from '../components/shared/Skeleton';
import ApiErrorState from '../components/shared/ApiErrorState';
import Button from '../components/Button/Button';
import { useApiList } from '../hooks/useApi';
import { api, ApiError } from '../utils/api';

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past & Cancelled' },
];

// Thin wrapper around useApiList that also exposes a setter, so a
// cancel action can update the list in place instead of refetching
// the whole page.
function useApiListWithSetter(path, params, options) {
  const result = useApiList(path, params, options);
  const [override, setOverride] = useState(null);

  const data = override ?? result.data;

  const setData = useCallback(
    (updater) => {
      setOverride((prev) => updater(prev ?? result.data));
    },
    [result.data]
  );

  return { ...result, data, setData };
}

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const { data: appointments, loading, error, setData } = useApiListWithSetter(
    '/appointments/',
    { page_size: 100, ordering: '-scheduled_date' },
    { auth: true }
  );

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const { upcoming, past } = useMemo(() => {
    const upcomingList = [];
    const pastList = [];
    for (const appt of appointments) {
      const isUpcoming = appt.scheduled_date >= today && appt.status !== 'cancelled' && appt.status !== 'completed';
      (isUpcoming ? upcomingList : pastList).push(appt);
    }
    upcomingList.sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
    pastList.sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date));
    return { upcoming: upcomingList, past: pastList };
  }, [appointments, today]);

  const visible = activeTab === 'upcoming' ? upcoming : past;

  const handleCancel = useCallback(
    async (id) => {
      setActionError('');
      setCancellingId(id);
      try {
        const updated = await api.post(`/appointments/${id}/cancel/`, {}, { auth: true });
        setData((prev) => prev.map((appt) => (appt.id === id ? updated : appt)));
      } catch (err) {
        setActionError(err instanceof ApiError ? err.message : 'Could not cancel this appointment.');
      } finally {
        setCancellingId(null);
      }
    },
    [setData]
  );

  return (
    <>
      <PageHero
        eyebrow="Your Care"
        title="My Appointments"
        description="Track upcoming visits and manage your booking history."
      />

      <section className="container-app pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-grad-primary text-white'
                      : 'bg-white text-ink-soft hover:text-teal-600 dark:bg-darksurface-card dark:text-white/60'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'upcoming' && upcoming.length > 0 && (
                    <span className="ml-1.5 opacity-80">({upcoming.length})</span>
                  )}
                </button>
              ))}
            </div>
            <Button to="/appointment" size="sm" icon={HiOutlinePlusCircle}>
              Book New
            </Button>
          </div>

          {actionError && (
            <p role="alert" className="mt-4 text-sm font-medium text-red-500">
              {actionError}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-4">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}

            {!loading && error && <ApiErrorState message="Couldn't load your appointments right now." />}

            {!loading && !error && visible.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 rounded-xl2 border border-dashed border-primary-100 bg-white/50 py-14 text-center dark:border-white/10 dark:bg-white/5"
              >
                <HiOutlineCalendarDays className="text-3xl text-ink-soft/60 dark:text-white/30" />
                <p className="font-display text-base font-bold text-ink dark:text-white">
                  {activeTab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments yet'}
                </p>
                {activeTab === 'upcoming' && (
                  <>
                    <p className="max-w-xs text-sm text-ink-soft dark:text-white/50">
                      When you book a visit, it'll show up here.
                    </p>
                    <Button to="/appointment" size="sm" className="mt-2">
                      Book an Appointment
                    </Button>
                  </>
                )}
              </motion.div>
            )}

            {!loading &&
              !error &&
              visible.map((appointment, i) => (
                <AppointmentDashboardCard
                  key={appointment.id}
                  appointment={appointment}
                  index={i}
                  onCancel={handleCancel}
                  cancelling={cancellingId === appointment.id}
                />
              ))}
          </div>

          <p className="mt-8 text-center text-xs text-ink-soft dark:text-white/40">
            Need to reschedule instead of cancel?{' '}
            <Link to="/contact" className="font-semibold text-teal-600 dark:text-teal-300">
              Contact us
            </Link>{' '}
            and we'll help you find a new time.
          </p>
        </div>
      </section>
    </>
  );
};

export default MyAppointments;
