import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineBars3, HiOutlineHeart } from 'react-icons/hi2';
import { NAV_LINKS, BRAND } from '../../constants';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import MobileMenu from '../MobileMenu/MobileMenu';
import AccountMenu from './AccountMenu';

const Navbar = () => {
  const { scrolled } = useScrollPosition(20);
  const { isAuthenticated, bootstrapping } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`flex w-full max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5 ${
            scrolled
              ? 'glass shadow-soft'
              : 'bg-white/40 backdrop-blur-md dark:bg-white/5'
          }`}
        >
          <Link to="/" className="flex items-center gap-2 pl-1" aria-label="MediCare+ home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-grad-primary text-white">
              <HiOutlineHeart className="text-lg" />
            </span>
            <span className="font-display text-lg font-extrabold text-primary-600 dark:text-white">
              {BRAND.name}
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 rounded-full border border-primary-100/60 bg-white/50 px-1.5 py-1.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5 lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-ink-soft hover:text-primary-600 dark:text-white/70 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-grad-primary"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {link.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            {!bootstrapping && (
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <AccountMenu />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Button to="/login" variant="ghost" size="sm">
                      Log In
                    </Button>
                    <Button to="/register" variant="secondary" size="sm">
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            )}
            <div className="hidden lg:block">
              <Button to="/appointment" size="sm">
                Book Appointment
              </Button>
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-primary-50 dark:text-white/70 dark:hover:bg-white/10 lg:hidden"
            >
              <HiOutlineBars3 className="text-2xl" />
            </button>
          </div>
        </motion.div>
      </header>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
