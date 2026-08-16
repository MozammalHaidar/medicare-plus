import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineStar, HiOutlineChevronLeft, HiOutlineChevronRight, HiMiniChatBubbleBottomCenterText } from 'react-icons/hi2';
import { useApiList } from '../../hooks/useApi';
import Skeleton from '../shared/Skeleton';
import ApiErrorState from '../shared/ApiErrorState';

const TestimonialCard = () => {
  const { data: testimonials, loading, error } = useApiList('/testimonials/');
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-64 w-full rounded-xl3" />
      </div>
    );
  }

  if (error) return <ApiErrorState message="Couldn't load testimonials right now." />;
  if (testimonials.length === 0) return null;

  const safeIndex = ((index % testimonials.length) + testimonials.length) % testimonials.length;
  const current = testimonials[safeIndex];

  const paginate = (dir) => {
    setDirection(dir);
    setIndex((prev) => prev + dir);
  };

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-xl3 bg-white p-8 shadow-card dark:bg-darksurface-card sm:p-12">
        <HiMiniChatBubbleBottomCenterText className="text-4xl text-teal-100 dark:text-teal-500/20" aria-hidden="true" />
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p className="mt-4 text-lg font-medium leading-relaxed text-ink dark:text-white sm:text-xl">
              "{current.quote}"
            </p>
            <div className="mt-6 flex items-center gap-4">
              {current.image ? (
                <img src={current.image} alt="" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 font-display text-sm font-bold text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
                  {current.patient_name?.[0]}
                </span>
              )}
              <div>
                <p className="font-display text-sm font-bold text-ink dark:text-white">{current.patient_name}</p>
                <p className="text-xs text-ink-soft dark:text-white/50">{current.role}</p>
              </div>
              <div className="ml-auto flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <HiOutlineStar key={i} className="fill-amber-400" />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => paginate(-1)}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-soft shadow-soft transition-colors hover:text-teal-600 dark:bg-darksurface-card dark:text-white/60"
        >
          <HiOutlineChevronLeft />
        </button>
        <div className="flex gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => {
                setDirection(i > safeIndex ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === safeIndex ? 'w-6 bg-teal-500' : 'w-2 bg-primary-100 dark:bg-white/20'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => paginate(1)}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-soft shadow-soft transition-colors hover:text-teal-600 dark:bg-darksurface-card dark:text-white/60"
        >
          <HiOutlineChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCard;
