import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from '../../hooks/useClickOutside';

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useClickOutside(wrapperRef, () => setOpen(false));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/doctors?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex items-center">
      <AnimatePresence>
        {open && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctors, specialties..."
              aria-label="Search doctors and specialties"
              className="w-full rounded-full border border-primary-100 bg-white px-4 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:border-teal-400 dark:bg-darksurface-card dark:text-white dark:border-white/10"
            />
          </motion.form>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close search' : 'Open search'}
        className="ml-2 flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-primary-50 dark:text-white/70 dark:hover:bg-white/10"
      >
        {open ? <HiXMark className="text-lg" /> : <HiOutlineMagnifyingGlass className="text-lg" />}
      </button>
    </div>
  );
};

export default SearchBar;
