import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlinePaperAirplane } from 'react-icons/hi2';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { api, ApiError } from '../../utils/api';

const initialValues = { name: '', email: '', subject: '', message: '' };

const ContactForm = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await api.post('/contact/', values);
      setSubmitted(true);
      setValues(initialValues);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        // Backend field errors arrive as {field: ["message"]} — flatten to {field: "message"}.
        const fieldErrors = Object.fromEntries(
          Object.entries(err.errors).map(([field, msgs]) => [field, Array.isArray(msgs) ? msgs[0] : msgs])
        );
        setErrors(fieldErrors);
      } else {
        setErrors({ message: err.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 rounded-xl2 bg-teal-50 p-10 text-center dark:bg-teal-500/10"
      >
        <HiOutlineCheckCircle className="text-4xl text-teal-600 dark:text-teal-300" />
        <h3 className="font-display text-xl font-bold text-ink dark:text-white">Message sent</h3>
        <p className="max-w-sm text-sm text-ink-soft dark:text-white/60">
          Thanks for reaching out — our care team typically replies within one business day.
        </p>
        <Button variant="secondary" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input label="Full Name" value={values.name} onChange={handleChange('name')} error={errors.name} placeholder="Jordan Lee" autoComplete="name" />
        <Input label="Email Address" type="email" value={values.email} onChange={handleChange('email')} error={errors.email} placeholder="jordan@email.com" autoComplete="email" />
      </div>
      <Input label="Subject" value={values.subject} onChange={handleChange('subject')} error={errors.subject} placeholder="How can we help?" />
      <Input
        label="Message"
        as="textarea"
        value={values.message}
        onChange={handleChange('message')}
        error={errors.message}
        placeholder="Tell us a little more..."
      />
      <Button type="submit" icon={HiOutlinePaperAirplane} className="self-start" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};

export default ContactForm;
