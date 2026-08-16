import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineCheckCircle } from 'react-icons/hi2';
import { api, ApiError } from '../../utils/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post('/newsletter/', { email });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errors?.email?.[0] || err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-app">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 rounded-xl3 border border-primary-100/60 bg-white px-6 py-12 text-center dark:border-white/10 dark:bg-darksurface-card sm:px-12"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
          <HiOutlineEnvelope className="text-2xl" />
        </span>
        <div>
          <h3 className="font-display text-2xl font-extrabold text-ink dark:text-white">Health tips in your inbox</h3>
          <p className="mt-2 max-w-md text-sm text-ink-soft dark:text-white/60">
            One short email a month — new articles, seasonal wellness tips, and screening reminders.
          </p>
        </div>

        {subscribed ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-teal-600 dark:text-teal-300">
            <HiOutlineCheckCircle className="text-lg" /> You're subscribed — welcome aboard.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-full border border-primary-100 bg-surface-muted px-5 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:border-teal-400 dark:border-white/10 dark:bg-darksurface dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-grad-primary px-6 py-3 text-sm font-bold text-white shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        {error && <p role="alert" className="text-xs font-medium text-red-500">{error}</p>}
      </motion.div>
    </section>
  );
};

export default Newsletter;
