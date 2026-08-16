import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlineLockClosed } from 'react-icons/hi2';
import PageHero from '../components/shared/PageHero';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../utils/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/profile';

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await login(values.email, values.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({ form: err.message || 'Invalid email or password.' });
      } else {
        setErrors({ form: 'Something went wrong. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Welcome Back" title="Log in to your account" description="Access your appointments, records, and profile." />
      <section className="container-app pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md rounded-xl3 bg-white p-8 shadow-card dark:bg-darksurface-card sm:p-10"
        >
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
            <HiOutlineLockClosed className="text-xl" />
          </span>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
            <Input
              label="Email Address"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              placeholder="jordan@email.com"
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            {errors.form && (
              <p role="alert" className="text-sm font-medium text-red-500">
                {errors.form}
              </p>
            )}
            <Button type="submit" icon={HiOutlineArrowRight} disabled={submitting} className="w-full justify-center">
              {submitting ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft dark:text-white/50">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-teal-600 dark:text-teal-300">
              Create one
            </Link>
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default Login;
