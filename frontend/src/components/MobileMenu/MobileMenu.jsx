import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiXMark, HiOutlineUser, HiOutlineCalendarDays, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { NAV_LINKS, BRAND } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0 },
};

const MobileMenu = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, bootstrapping, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-ink/50 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[95] flex h-full w-[82%] max-w-sm flex-col bg-white p-6 shadow-card dark:bg-darksurface-raised lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-lg font-extrabold text-primary-600 dark:text-white">
                {BRAND.name}
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-full p-2 text-ink-soft hover:bg-primary-50 dark:text-white/70 dark:hover:bg-white/10"
              >
                <HiXMark className="text-2xl" />
              </button>
            </div>

            {!bootstrapping && isAuthenticated && (
              <div className="mb-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/profile');
                  }}
                  className="flex items-center gap-3 rounded-2xl bg-primary-50 px-4 py-3 text-left dark:bg-white/5"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-grad-primary text-sm font-bold text-white">
                      {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-ink dark:text-white">{user.full_name}</p>
                    <p className="text-xs text-ink-soft dark:text-white/50">View profile</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/appointments');
                  }}
                  className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-ink-soft transition-colors hover:bg-primary-50 dark:text-white/70 dark:hover:bg-white/5"
                >
                  <HiOutlineCalendarDays className="text-base" /> My Appointments
                </button>
              </div>
            )}

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35 }}
                >
                  <NavLink
                    to={link.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                        isActive
                          ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300'
                          : 'text-ink-soft hover:bg-primary-50 dark:text-white/70 dark:hover:bg-white/5'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4 pt-8">
              <div className="flex items-center justify-between rounded-2xl bg-primary-50 px-4 py-3 dark:bg-white/5">
                <span className="text-sm font-semibold text-ink-soft dark:text-white/70">Appearance</span>
                <ThemeToggle />
              </div>

              {!bootstrapping && (
                isAuthenticated ? (
                  <Button variant="ghost" icon={HiOutlineArrowRightOnRectangle} onClick={handleLogout} className="w-full justify-center">
                    Log Out
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button to="/login" variant="secondary" onClick={onClose} className="flex-1 justify-center">
                      Log In
                    </Button>
                    <Button to="/register" icon={HiOutlineUser} onClick={onClose} className="flex-1 justify-center">
                      Sign Up
                    </Button>
                  </div>
                )
              )}

              <Button to="/appointment" onClick={onClose} className="w-full justify-center">
                Book Appointment
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
