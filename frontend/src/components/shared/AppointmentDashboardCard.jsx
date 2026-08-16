import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineVideoCamera,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineXCircle,
} from 'react-icons/hi2';
import { formatDate } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';

const VISIT_TYPE_META = {
  video: { label: 'Video Visit', icon: HiOutlineVideoCamera },
  inperson: { label: 'In-Person', icon: HiOutlineBuildingOffice2 },
  athome: { label: 'At-Home', icon: HiOutlineCalendarDays },
};

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
  confirmed: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300',
  completed: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
  cancelled: 'bg-ink/5 text-ink-soft dark:bg-white/10 dark:text-white/40',
};

const AppointmentDashboardCard = ({ appointment, index = 0, onCancel, cancelling }) => {
  const [confirming, setConfirming] = useState(false);
  const visitMeta = VISIT_TYPE_META[appointment.visit_type] || VISIT_TYPE_META.video;
  const VisitIcon = visitMeta.icon;

  const canCancel = ['pending', 'confirmed'].includes(appointment.status);

  const handleConfirmCancel = () => {
    setConfirming(false);
    onCancel(appointment.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="flex flex-col gap-4 rounded-xl2 bg-white p-5 shadow-soft dark:bg-darksurface-card sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl2 bg-primary-50 text-primary-600 dark:bg-white/5 dark:text-teal-300">
          <VisitIcon className="text-xl" />
        </span>
        <div>
          <p className="font-display text-base font-bold text-ink dark:text-white">{appointment.doctor_name}</p>
          <p className="text-sm text-ink-soft dark:text-white/50">{appointment.specialty_name}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft dark:text-white/50">
            <span className="flex items-center gap-1">
              <HiOutlineCalendarDays /> {formatDate(appointment.scheduled_date)}
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineClock /> {formatTime(appointment.scheduled_time)}
            </span>
            <span>{visitMeta.label}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_STYLES[appointment.status] || STATUS_STYLES.pending}`}>
          {appointment.status}
        </span>

        {canCancel && (
          confirming ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
              >
                {cancelling ? 'Cancelling...' : 'Confirm'}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-primary-50 dark:text-white/50 dark:hover:bg-white/10"
              >
                Keep it
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <HiOutlineXCircle /> Cancel
            </button>
          )
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentDashboardCard;
