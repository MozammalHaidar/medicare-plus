import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineArrowUp } from 'react-icons/hi2';
import { useScrollPosition } from '../../hooks/useScrollPosition';

const ScrollTopButton = () => {
  const { scrolled } = useScrollPosition(480);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-grad-primary text-white shadow-card sm:bottom-8 sm:right-8"
        >
          <HiOutlineArrowUp className="text-xl" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollTopButton;
