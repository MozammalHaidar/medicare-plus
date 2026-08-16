import { useId } from 'react';

const Input = ({
  label,
  type = 'text',
  as = 'input',
  error,
  className = '',
  rows = 5,
  ...props
}) => {
  const id = useId();
  const Component = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-semibold text-ink-soft dark:text-white/70"
        >
          {label}
        </label>
      )}
      <Component
        id={id}
        type={as === 'input' ? type : undefined}
        rows={as === 'textarea' ? rows : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-2xl border bg-white px-5 py-3.5 text-sm text-ink placeholder:text-ink-soft/50 transition-colors duration-200 focus:border-teal-400 dark:bg-darksurface-card dark:text-white dark:placeholder:text-white/30 ${
          error ? 'border-red-400' : 'border-primary-100 dark:border-white/10'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
