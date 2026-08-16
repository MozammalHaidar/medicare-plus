import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineCalendarDays, HiOutlineVideoCamera, HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import PageHero from '../components/shared/PageHero';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useApiDetail, useApiList } from '../hooks/useApi';
import { api, ApiError } from '../utils/api';
import { formatTime as formatSlotLabel } from '../utils/formatTime';

const VISIT_TYPES = [
  { id: 'video', label: 'Video Visit', icon: HiOutlineVideoCamera },
  { id: 'inperson', label: 'In-Person', icon: HiOutlineBuildingOffice2 },
  { id: 'athome', label: 'At-Home', icon: HiOutlineCalendarDays },
];

const FALLBACK_TIME_SLOTS = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'];

// JS Date.getDay() is Sunday=0..Saturday=6; the backend's Python
// weekday() (and DoctorAvailability.weekday) is Monday=0..Sunday=6.
const toBackendWeekday = (jsDay) => (jsDay + 6) % 7;

/** Generates hourly slot strings ("HH:MM") between a start/end "HH:MM:SS" range. */
const generateSlotsInRange = (startTime, endTime) => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const slots = [];
  let h = startH;
  let m = startM;
  while (h < endH || (h === endH && m < endM)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    m += 60;
    if (m >= 60) {
      m -= 60;
      h += 1;
    }
  }
  return slots;
};

const initialValues = {
  name: '',
  email: '',
  phone: '',
  specialty: '',
  doctor: '',
  visitType: 'video',
  date: '',
  time: '',
  notes: '',
};

const validateClientSide = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email.';
  if (!values.phone.trim()) errors.phone = 'Please enter a phone number.';
  if (!values.doctor) errors.doctor = 'Please choose a doctor.';
  if (!values.date) errors.date = 'Pick a preferred date.';
  if (!values.time) errors.time = 'Pick a preferred time.';
  return errors;
};

const Appointment = () => {
  const location = useLocation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const { data: specialties } = useApiList('/specialties/');
  const { data: doctors } = useApiList('/doctors/', {
    specialty: values.specialty || undefined,
    ordering: 'name',
  });

  const selectedDoctor = doctors.find((d) => String(d.id) === values.doctor);
  const { data: selectedDoctorDetail } = useApiDetail(
    selectedDoctor ? `/doctors/${selectedDoctor.slug}/` : null,
    { enabled: !!selectedDoctor }
  );

  const { timeSlots, noAvailabilityThisDay } = useMemo(() => {
    if (!selectedDoctorDetail || !values.date) {
      return { timeSlots: FALLBACK_TIME_SLOTS, noAvailabilityThisDay: false };
    }
    const slots = selectedDoctorDetail.availability_slots || [];
    if (slots.length === 0) {
      return { timeSlots: FALLBACK_TIME_SLOTS, noAvailabilityThisDay: false };
    }
    const weekday = toBackendWeekday(new Date(`${values.date}T00:00:00`).getDay());
    const daySlots = slots.filter((s) => s.weekday === weekday);
    if (daySlots.length === 0) {
      return { timeSlots: [], noAvailabilityThisDay: true };
    }
    const generated = daySlots.flatMap((s) => generateSlotsInRange(s.start_time, s.end_time));
    return { timeSlots: generated, noAvailabilityThisDay: false };
  }, [selectedDoctorDetail, values.date]);

  // Arrived via "Book Appointment" on a doctor card — preselect it.
  useEffect(() => {
    if (location.state?.specialtySlug) {
      setValues((prev) => ({ ...prev, specialty: location.state.specialtySlug }));
    }
    if (location.state?.doctorId) {
      setValues((prev) => ({ ...prev, doctor: String(location.state.doctorId) }));
    }
  }, [location.state]);

  useEffect(() => {
    setValues((prev) => (prev.time ? { ...prev, time: '' } : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.doctor, values.date]);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSpecialtyChange = (e) => {
    setValues((prev) => ({ ...prev, specialty: e.target.value, doctor: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validateClientSide(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    try {
      await api.post('/appointments/', {
        guest_name: values.name,
        guest_email: values.email,
        guest_phone: values.phone,
        doctor: Number(values.doctor),
        visit_type: values.visitType,
        scheduled_date: values.date,
        scheduled_time: `${values.time}:00`,
        notes: values.notes,
      });
      setConfirmed(true);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const fieldMap = {
          guest_name: 'name',
          guest_email: 'email',
          guest_phone: 'phone',
          scheduled_date: 'date',
          scheduled_time: 'time',
          visit_type: 'visitType',
          non_field_errors: 'time',
        };
        const mapped = {};
        Object.entries(err.errors).forEach(([field, msgs]) => {
          const key = fieldMap[field] || field;
          mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors(mapped);
      } else {
        setErrors({ time: err.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <>
        <PageHero eyebrow="Appointment" title="Booking Confirmed" />
        <section className="container-app pb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-xl3 bg-white p-10 text-center shadow-card dark:bg-darksurface-card"
          >
            <HiOutlineCheckCircle className="text-5xl text-teal-600 dark:text-teal-300" />
            <h2 className="font-display text-2xl font-extrabold text-ink dark:text-white">You're all set, {values.name.split(' ')[0]}</h2>
            <p className="text-sm text-ink-soft dark:text-white/60">
              A confirmation has been sent to <strong>{values.email}</strong> for your {formatSlotLabel(values.time)} visit on {values.date}.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmed(false);
                setValues(initialValues);
              }}
            >
              Book Another Appointment
            </Button>
          </motion.div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Book a Visit"
        title="Schedule your appointment"
        description="Tell us a little about what you need, and we'll match you with the right care team."
      />
      <section className="container-app pb-24">
        <form onSubmit={handleSubmit} noValidate className="mx-auto grid max-w-4xl grid-cols-1 gap-8 rounded-xl3 bg-white p-6 shadow-card dark:bg-darksurface-card sm:p-10 lg:grid-cols-2">
          <Input label="Full Name" value={values.name} onChange={handleChange('name')} error={errors.name} placeholder="Jordan Lee" />
          <Input label="Email Address" type="email" value={values.email} onChange={handleChange('email')} error={errors.email} placeholder="jordan@email.com" />
          <Input label="Phone Number" type="tel" value={values.phone} onChange={handleChange('phone')} error={errors.phone} placeholder="(555) 000-0000" />

          <div>
            <label htmlFor="specialty" className="mb-2 block text-sm font-semibold text-ink-soft dark:text-white/70">
              Specialty <span className="font-normal text-ink-soft/60">(optional filter)</span>
            </label>
            <select
              id="specialty"
              value={values.specialty}
              onChange={handleSpecialtyChange}
              className="w-full rounded-2xl border border-primary-100 bg-white px-5 py-3.5 text-sm text-ink dark:border-white/10 dark:bg-darksurface dark:text-white"
            >
              <option value="">All specialties</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="doctor" className="mb-2 block text-sm font-semibold text-ink-soft dark:text-white/70">
              Doctor
            </label>
            <select
              id="doctor"
              value={values.doctor}
              onChange={handleChange('doctor')}
              className={`w-full rounded-2xl border bg-white px-5 py-3.5 text-sm text-ink dark:bg-darksurface dark:text-white ${
                errors.doctor ? 'border-red-400' : 'border-primary-100 dark:border-white/10'
              }`}
            >
              <option value="">Select a doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name} — {d.specialty_name}</option>
              ))}
            </select>
            {errors.doctor && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.doctor}</p>}
          </div>

          <Input label="Preferred Date" type="date" value={values.date} onChange={handleChange('date')} error={errors.date} />

          <div>
            <span className="mb-2 block text-sm font-semibold text-ink-soft dark:text-white/70">Preferred Time</span>
            {noAvailabilityThisDay ? (
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                This doctor isn't scheduled on the selected day — try a different date.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setValues((prev) => ({ ...prev, time: slot }))}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                      values.time === slot
                        ? 'border-teal-500 bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300'
                        : 'border-primary-100 text-ink-soft hover:border-teal-300 dark:border-white/10 dark:text-white/50'
                    }`}
                  >
                    {formatSlotLabel(slot)}
                  </button>
                ))}
              </div>
            )}
            {errors.time && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.time}</p>}
          </div>

          <div className="lg:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-ink-soft dark:text-white/70">Visit Type</span>
            <div className="grid grid-cols-3 gap-3">
              {VISIT_TYPES.map((type) => {
                const Icon = type.icon;
                const active = values.visitType === type.id;
                return (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setValues((prev) => ({ ...prev, visitType: type.id }))}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-xs font-semibold transition-colors ${
                      active
                        ? 'border-teal-500 bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300'
                        : 'border-primary-100 text-ink-soft hover:border-teal-300 dark:border-white/10 dark:text-white/50'
                    }`}
                  >
                    <Icon className="text-xl" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Input label="Notes for your doctor (optional)" as="textarea" rows={4} value={values.notes} onChange={handleChange('notes')} placeholder="Symptoms, questions, or anything we should know beforehand..." />
          </div>

          <div className="lg:col-span-2">
            <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
              {submitting ? 'Booking...' : 'Confirm Appointment'}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Appointment;
