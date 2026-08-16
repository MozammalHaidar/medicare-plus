import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-surface-muted dark:bg-darksurface">
      <svg width="180" height="60" viewBox="0 0 180 60" fill="none" aria-hidden="true">
        <motion.path
          d="M0 30 H55 L65 8 L78 52 L88 30 H180"
          stroke="#0D9C8F"
          strokeWidth="3.5"
          className="vital-line-path"
        />
      </svg>
      <p className="font-display text-sm font-semibold tracking-wide text-primary-600 dark:text-teal-300">
        MediCare<span className="text-teal-500">+</span>
      </p>
      <span className="sr-only">Loading MediCare+</span>
    </div>
  );
};

export default Loader;
