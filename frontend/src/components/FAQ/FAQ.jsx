import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import { useApiList } from '../../hooks/useApi';
import Skeleton from '../shared/Skeleton';
import ApiErrorState from '../shared/ApiErrorState';

const FAQ = () => {
  const { data: faqs, loading, error } = useApiList('/faqs/');
  const [openId, setOpenId] = useState(null);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) return <ApiErrorState message="Couldn't load FAQs right now." />;
  if (faqs.length === 0) return null;

  const activeId = openId ?? faqs[0].id;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      {faqs.map((faq) => {
        const isOpen = activeId === faq.id;
        return (
          <div
            key={faq.id}
            className="overflow-hidden rounded-2xl border border-primary-100/60 bg-white dark:border-white/10 dark:bg-darksurface-card"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span className="font-display text-sm font-bold text-ink dark:text-white sm:text-base">
                {faq.question}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 text-teal-600 dark:text-teal-300"
              >
                <HiOutlineChevronDown />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft dark:text-white/60">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default FAQ;
