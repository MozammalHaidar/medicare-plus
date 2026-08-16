import { motion } from 'framer-motion';
import { HiOutlineStar, HiOutlineCheckBadge, HiOutlineArrowRight } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const FALLBACK_AVATAR_BASE = 'https://i.pravatar.cc/400?img=';

const DoctorCard = ({ doctor, index = 0 }) => {
  const avatar = doctor.image || `${FALLBACK_AVATAR_BASE}${((doctor.id ?? index) % 70) + 1}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-xl2 bg-white shadow-soft transition-shadow duration-300 hover:shadow-card dark:bg-darksurface-card"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={avatar}
          alt={doctor.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-teal-600 shadow-soft">
          {doctor.specialty_name}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-ink dark:text-white">{doctor.name}</h3>
        <p className="mt-0.5 text-sm text-ink-soft dark:text-white/50">{doctor.experience_years} years experience</p>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 font-semibold text-amber-500">
            <HiOutlineStar className="fill-amber-400" />
            {Number(doctor.rating_avg).toFixed(1)}{' '}
            <span className="text-ink-soft/70 dark:text-white/40">({doctor.rating_count})</span>
          </span>
          {doctor.is_active && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
              <HiOutlineCheckBadge />
              Accepting Patients
            </span>
          )}
        </div>

        <Link
          to="/appointment"
          state={{ doctorId: doctor.id, specialtySlug: doctor.specialty_slug }}
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary-50 py-2.5 text-sm font-bold text-primary-600 transition-colors duration-300 hover:bg-grad-primary hover:text-white dark:bg-white/5 dark:text-teal-300"
        >
          Book Appointment
          <HiOutlineArrowRight />
        </Link>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
