import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlineShieldCheck, HiOutlineStar } from 'react-icons/hi2';
import Button from '../Button/Button';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-grad-hero pb-20 pt-32 dark:bg-none dark:bg-darksurface sm:pt-40">
      {/* ambient shapes */}
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-500/10" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" aria-hidden="true" />

      <div className="container-app relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-600 shadow-soft dark:bg-white/10 dark:text-teal-300">
            <HiOutlineShieldCheck className="text-base" />
            Trusted by 40+ accredited clinics
          </motion.div>

          <motion.h1 variants={item} className="max-w-xl text-4xl font-extrabold leading-[1.1] text-ink dark:text-white sm:text-5xl lg:text-[3.4rem]">
            Care that keeps <span className="bg-grad-cta bg-clip-text text-transparent">pace with you</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-md text-base leading-relaxed text-ink-soft dark:text-white/60 sm:text-lg">
            Book board-certified doctors, manage records, and get care from home — all inside one platform built around your schedule, not the clinic's.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/appointment" icon={HiOutlineArrowRight}>
              Book an Appointment
            </Button>
            <Button to="/doctors" variant="secondary">
              Find a Doctor
            </Button>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[5, 12, 25, 33].map((seed) => (
                <img
                  key={seed}
                  src={`https://i.pravatar.cc/64?img=${seed}`}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-darksurface "
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <HiOutlineStar key={i} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-sm font-semibold text-ink-soft dark:text-white/60">12,000+ patient reviews</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-xl3 shadow-card">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80"
              alt="Physician consulting with a patient in a bright clinic room"
              className="h-[420px] w-full object-cover"
            />
          </div>

          {/* floating vital card */}
          {/* <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-8 top-10 w-44 rounded-2xl bg-white/90 p-4 shadow-card backdrop-blur-md dark:bg-darksurface-card/90"
          >
            <p className="text-xs font-semibold text-ink-soft dark:text-white/50">Heart Rate</p>
            <p className="text-2xl font-extrabold text-ink dark:text-white">72 <span className="text-sm font-medium text-ink-soft dark:text-white/50">bpm</span></p>
            <svg width="100%" height="28" viewBox="0 0 140 28" fill="none" aria-hidden="true">
              <path d="M0 14 H40 L48 4 L58 24 L66 14 H140" stroke="#0D9C8F" strokeWidth="2" className="vital-line-path" />
            </svg>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -right-6 bottom-10 w-48 rounded-2xl bg-white/90 p-4 shadow-card backdrop-blur-md dark:bg-darksurface-card/90"
          >
            <p className="text-xs font-semibold text-ink-soft dark:text-white/50">Next Appointment</p>
            <p className="mt-1 text-sm font-bold text-ink dark:text-white">Dr. Amara Whitfield</p>
            <p className="text-xs text-teal-600 dark:text-teal-300">Today, 3:30 PM</p>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
