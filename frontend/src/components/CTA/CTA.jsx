import { motion } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import Button from '../Button/Button';
import VitalLine from '../shared/VitalLine';

const CTA = ({
  title = 'Ready to feel better, faster?',
  description = 'Book a consultation today and get matched with the right specialist in minutes.',
  primaryLabel = 'Book an Appointment',
  primaryTo = '/appointment',
  secondaryLabel = 'Contact Us',
  secondaryTo = '/contact',
}) => {
  return (
    <section className="container-app">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-xl3 bg-grad-primary px-8 py-14 text-center sm:px-16"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-teal-400/20 blur-2xl" aria-hidden="true" />
        <div className="relative flex flex-col items-center gap-5">
          <VitalLine color="#5EEAD4" width={140} />
          <h2 className="max-w-xl text-3xl font-extrabold text-white sm:text-4xl">{title}</h2>
          <p className="max-w-md text-white/70">{description}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            <Button to={primaryTo} variant="secondary" icon={HiOutlineArrowRight}>
              {primaryLabel}
            </Button>
            <Button to={secondaryTo} variant="outline">
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
