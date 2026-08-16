import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { resolveIcon } from '../../utils/iconMap';

const SpecialtyCard = ({ specialty, index = 0 }) => {
  const Icon = resolveIcon(specialty.icon_key);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07 }}
    >
      <Link
        to={`/doctors?specialty=${specialty.slug}`}
        className="group flex h-full flex-col items-start gap-4 rounded-xl2 border border-primary-100/60 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-card dark:border-white/10 dark:bg-darksurface-card"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl2 bg-teal-50 text-teal-600 transition-colors duration-300 group-hover:bg-grad-primary group-hover:text-white dark:bg-teal-500/10 dark:text-teal-300">
          <Icon className="text-2xl" />
        </span>
        <div>
          <h3 className="font-display text-base font-bold text-ink dark:text-white">{specialty.name}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-white/50">{specialty.description}</p>
        </div>
        <span className="mt-auto text-xs font-bold uppercase tracking-wide text-teal-600 dark:text-teal-300">
          {specialty.doctor_count} Doctor{specialty.doctor_count === 1 ? '' : 's'}
        </span>
      </Link>
    </motion.div>
  );
};

export default SpecialtyCard;
