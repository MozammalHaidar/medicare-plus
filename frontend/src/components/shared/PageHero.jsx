import { motion } from 'framer-motion';
import VitalLine from './VitalLine';

const PageHero = ({ eyebrow, title, description }) => {
  return (
    <section className="relative overflow-hidden bg-grad-hero pb-16 pt-32 dark:bg-none dark:bg-darksurface sm:pt-40">
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-500/10" aria-hidden="true" />
      <div className="container-app relative flex flex-col items-center gap-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-600 dark:bg-teal-500/10 dark:text-teal-300"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl text-4xl font-extrabold leading-tight text-ink dark:text-white sm:text-5xl"
        >
          {title}
        </motion.h1>
        <VitalLine width={160} />
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl text-base text-ink-soft dark:text-white/60"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default PageHero;
