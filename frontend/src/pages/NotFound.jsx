import { motion } from 'framer-motion';
import Button from '../components/Button/Button';

const NotFound = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <svg width="220" height="60" viewBox="0 0 220 60" fill="none" aria-hidden="true">
        <motion.path
          d="M0 30 H70 L82 8 L96 52 L110 30 H220"
          stroke="#0D9C8F"
          strokeWidth="3"
          className="vital-line-path"
        />
      </svg>
      <h1 className="font-display text-6xl font-extrabold text-primary-600 dark:text-white">404</h1>
      <h2 className="font-display text-xl font-bold text-ink dark:text-white">This page didn't make it to the chart</h2>
      <p className="max-w-sm text-sm text-ink-soft dark:text-white/50">
        The page you're looking for may have moved or no longer exists. Let's get you back to care.
      </p>
      <div className="flex gap-4">
        <Button to="/">Back to Home</Button>
        <Button to="/contact" variant="secondary">Contact Support</Button>
      </div>
    </section>
  );
};

export default NotFound;
