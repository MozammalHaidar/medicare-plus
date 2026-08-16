import { motion } from 'framer-motion';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      className="relative flex h-9 w-16 items-center rounded-full bg-primary-100 px-1 transition-colors duration-300 dark:bg-primary-700"
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary-600 shadow-soft"
        style={{ marginLeft: isDark ? '28px' : '0px' }}
      >
        {isDark ? <HiOutlineMoon className="text-sm" /> : <HiOutlineSun className="text-sm" />}
      </motion.span>
    </button>
  );
};

export default ThemeToggle;
