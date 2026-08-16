import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlineUserPlus } from 'react-icons/hi2';
import PageHero from '../components/shared/PageHero';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../utils/api';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
};

const validateClientSide = (values) => {
  const errors = {};
  if (!values.firstName.trim()) errors.firstName = 'Required.';
  if (!values.lastName.trim()) errors.lastName = 'Required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email.';
  if (values.password.length < 8) errors.password = 'At least 8 characters.';
  if (values.password !== values.passwordConfirm) errors.passwordConfirm = 'Passwords do not match.';
  return errors;
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validateClientSide(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register(values);
      navigate('/profile', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const fieldMap = {
          email: 'email',
          first_name: 'firstName',
          last_name: 'lastName',
          phone: 'phone',
          password: 'password',
          password_confirm: 'passwordConfirm',
        };
        const mapped = {};
        Object.entries(err.errors).forEach(([field, msgs]) => {
          const key = fieldMap[field] || field;
          mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors(mapped);
      } else {
        setErrors({ form: err.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Join MediCare+" title="Create your account" description="Book appointments faster and keep your care history in one place." />
      <section className="container-app pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-lg rounded-xl3 bg-white p-8 shadow-card dark:bg-darksurface-card sm:p-10"
        >
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
            <HiOutlineUserPlus className="text-xl" />
          </span>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="First Name" value={values.firstName} onChange={handleChange('firstName')} error={errors.firstName} placeholder="Jordan" autoComplete="given-name" />
              <Input label="Last Name" value={values.lastName} onChange={handleChange('lastName')} error={errors.lastName} placeholder="Lee" autoComplete="family-name" />
            </div>
            <Input label="Email Address" type="email" value={values.email} onChange={handleChange('email')} error={errors.email} placeholder="jordan@email.com" autoComplete="email" />
            <Input label="Phone Number (optional)" type="tel" value={values.phone} onChange={handleChange('phone')} error={errors.phone} placeholder="(555) 000-0000" autoComplete="tel" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="Password" type="password" value={values.password} onChange={handleChange('password')} error={errors.password} placeholder="••••••••" autoComplete="new-password" />
              <Input label="Confirm Password" type="password" value={values.passwordConfirm} onChange={handleChange('passwordConfirm')} error={errors.passwordConfirm} placeholder="••••••••" autoComplete="new-password" />
            </div>
            {errors.form && (
              <p role="alert" className="text-sm font-medium text-red-500">
                {errors.form}
              </p>
            )}
            <Button type="submit" icon={HiOutlineArrowRight} disabled={submitting} className="w-full justify-center">
              {submitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft dark:text-white/50">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-600 dark:text-teal-300">
              Log in
            </Link>
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default Register;
