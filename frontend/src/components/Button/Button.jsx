import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const VARIANTS = {
  primary:
    'bg-grad-primary text-white shadow-soft hover:shadow-glow',
  secondary:
    'bg-white text-primary-600 border border-primary-100 hover:border-teal-300 dark:bg-darksurface-card dark:text-white dark:border-white/10',
  ghost:
    'bg-transparent text-ink hover:bg-primary-50 dark:text-white dark:hover:bg-white/5',
  outline:
    'bg-transparent border-2 border-white/70 text-white hover:bg-white/10',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  type = 'button',
  className = '',
  icon: Icon,
  iconPosition = 'right',
  ...props
}) => {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-all duration-300 focus-visible:outline-2 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="text-lg" aria-hidden="true" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="text-lg" aria-hidden="true" />}
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
  };

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link to={to} className={classes} {...props}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        {...motionProps}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} className={classes} onClick={onClick} {...motionProps} {...props}>
      {content}
    </motion.button>
  );
};

export default Button;
