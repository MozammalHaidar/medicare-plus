import { motion } from 'framer-motion';
import VitalLine from '../shared/VitalLine';

const SectionTitle = ({ eyebrow, title, description, align = 'center', light = false }) => {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`flex flex-col ${alignment} gap-4`}
    >
      {eyebrow && (
        <span
          className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
            light ? 'bg-white/10 text-teal-200' : 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl ${
          light ? 'text-white' : 'text-ink dark:text-white'
        }`}
      >
        {title}
      </h2>
      <VitalLine width={160} color={light ? '#5EEAD4' : '#0D9C8F'} />
      {description && (
        <p className={`max-w-xl text-base leading-relaxed ${light ? 'text-white/70' : 'text-ink-soft dark:text-white/60'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
