import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineArrowRightOnRectangle, HiOutlineShieldCheck, HiOutlineCalendarDays, HiOutlineArrowRight } from 'react-icons/hi2';
import PageHero from '../components/shared/PageHero';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../utils/api';

const ROLE_LABELS = {
  patient: 'Patient',
  doctor: 'Doctor',
  admin: 'Administrator',
};

const ProfileDetailsForm = () => {
  const { user, updateProfile } = useAuth();
  const [values, setValues] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    phone: user.phone || '',
    date_of_birth: user.date_of_birth || '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await updateProfile({ ...values, date_of_birth: values.date_of_birth || null });
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const mapped = Object.fromEntries(
          Object.entries(err.errors).map(([field, msgs]) => [field, Array.isArray(msgs) ? msgs[0] : msgs])
        );
        setErrors(mapped);
      } else {
        setErrors({ form: err.message || 'Could not save changes.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input label="First Name" value={values.first_name} onChange={handleChange('first_name')} error={errors.first_name} />
        <Input label="Last Name" value={values.last_name} onChange={handleChange('last_name')} error={errors.last_name} />
      </div>
      <Input label="Email Address" value={user.email} disabled className="opacity-60" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input label="Phone Number" type="tel" value={values.phone} onChange={handleChange('phone')} error={errors.phone} placeholder="(555) 000-0000" />
        <Input label="Date of Birth" type="date" value={values.date_of_birth || ''} onChange={handleChange('date_of_birth')} error={errors.date_of_birth} />
      </div>
      {errors.form && <p className="text-sm font-medium text-red-500">{errors.form}</p>}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
        {saved && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 dark:text-teal-300"
          >
            <HiOutlineCheckCircle /> Saved
          </motion.span>
        )}
      </div>
    </form>
  );
};

const ChangePasswordForm = () => {
  const { changePassword } = useAuth();
  const [values, setValues] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setSuccess(false);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.newPassword !== values.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match.' });
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      await changePassword(values.oldPassword, values.newPassword);
      setValues({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const mapped = Object.fromEntries(
          Object.entries(err.errors).map(([field, msgs]) => [
            field === 'old_password' ? 'oldPassword' : field === 'new_password' ? 'newPassword' : field,
            Array.isArray(msgs) ? msgs[0] : msgs,
          ])
        );
        setErrors(mapped);
      } else {
        setErrors({ form: err.message || 'Could not change password.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Input label="Current Password" type="password" value={values.oldPassword} onChange={handleChange('oldPassword')} error={errors.oldPassword} autoComplete="current-password" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input label="New Password" type="password" value={values.newPassword} onChange={handleChange('newPassword')} error={errors.newPassword} autoComplete="new-password" />
        <Input label="Confirm New Password" type="password" value={values.confirmPassword} onChange={handleChange('confirmPassword')} error={errors.confirmPassword} autoComplete="new-password" />
      </div>
      {errors.form && <p className="text-sm font-medium text-red-500">{errors.form}</p>}
      <div className="flex items-center gap-4">
        <Button type="submit" variant="secondary" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Password'}
        </Button>
        {success && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 dark:text-teal-300"
          >
            <HiOutlineCheckCircle /> Password updated
          </motion.span>
        )}
      </div>
    </form>
  );
};

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Guards against a render where ProtectedRoute has already confirmed
  // auth but `user` hasn't populated yet on a fast navigation.
  useEffect(() => {
    if (user === null) navigate('/login', { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <PageHero eyebrow="Your Account" title={`Hi, ${user.first_name || user.full_name}`} description="Manage your profile and account security." />

      <section className="container-app pb-24">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 rounded-xl3 bg-white p-8 text-center shadow-card dark:bg-darksurface-card sm:flex-row sm:text-left"
          >
            {user.avatar ? (
              <img src={user.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-grad-primary font-display text-2xl font-bold text-white">
                {(user.first_name?.[0] || user.email[0]).toUpperCase()}
              </span>
            )}
            <div>
              <p className="font-display text-lg font-bold text-ink dark:text-white">{user.full_name}</p>
              <p className="text-sm text-ink-soft dark:text-white/50">{user.email}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
                <HiOutlineShieldCheck /> {ROLE_LABELS[user.role] || user.role}
              </span>
            </div>
            <Button variant="ghost" icon={HiOutlineArrowRightOnRectangle} onClick={handleLogout} className="sm:ml-auto">
              Log Out
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.02 }}
          >
            <Link
              to="/appointments"
              className="flex items-center justify-between gap-4 rounded-xl3 bg-grad-primary p-6 text-white shadow-card transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl2 bg-white/15">
                  <HiOutlineCalendarDays className="text-xl" />
                </span>
                <div>
                  <p className="font-display font-bold">My Appointments</p>
                  <p className="text-sm text-white/70">View upcoming visits and booking history</p>
                </div>
              </div>
              <HiOutlineArrowRight className="text-xl" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl3 bg-white p-8 shadow-card dark:bg-darksurface-card"
          >
            <h2 className="font-display text-xl font-bold text-ink dark:text-white">Profile Details</h2>
            <p className="mt-1 text-sm text-ink-soft dark:text-white/50">Keep your contact information current.</p>
            <div className="mt-6">
              <ProfileDetailsForm />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl3 bg-white p-8 shadow-card dark:bg-darksurface-card"
          >
            <h2 className="font-display text-xl font-bold text-ink dark:text-white">Change Password</h2>
            <p className="mt-1 text-sm text-ink-soft dark:text-white/50">Use a password you don't use anywhere else.</p>
            <div className="mt-6">
              <ChangePasswordForm />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Profile;
