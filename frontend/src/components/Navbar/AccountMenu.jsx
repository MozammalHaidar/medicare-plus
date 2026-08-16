import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineCalendarDays, HiOutlineArrowRightOnRectangle, HiOutlineChevronDown } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { useClickOutside } from '../../hooks/useClickOutside';

const AccountMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/', { replace: true });
  };

  const initial = (user.first_name?.[0] || user.email[0]).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-primary-50 dark:hover:bg-white/10"
      >
        {user.avatar ? (
          <img src={user.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-grad-primary text-xs font-bold text-white">
            {initial}
          </span>
        )}
        <span className="hidden text-sm font-semibold text-ink-soft dark:text-white/80 sm:inline">
          {user.first_name || 'Account'}
        </span>
        <HiOutlineChevronDown className={`text-xs text-ink-soft transition-transform dark:text-white/60 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-primary-100/60 bg-white py-2 shadow-card dark:border-white/10 dark:bg-darksurface-raised"
          >
            <button
              onClick={() => {
                setOpen(false);
                navigate('/profile');
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-ink-soft transition-colors hover:bg-primary-50 dark:text-white/70 dark:hover:bg-white/5"
            >
              <HiOutlineUser className="text-base" /> Profile
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate('/appointments');
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-ink-soft transition-colors hover:bg-primary-50 dark:text-white/70 dark:hover:bg-white/5"
            >
              <HiOutlineCalendarDays className="text-base" /> My Appointments
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <HiOutlineArrowRightOnRectangle className="text-base" /> Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountMenu;
