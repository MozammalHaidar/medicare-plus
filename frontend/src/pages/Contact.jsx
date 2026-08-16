import { motion } from 'framer-motion';
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope, HiOutlineClock } from 'react-icons/hi2';
import PageHero from '../components/shared/PageHero';
import ContactForm from '../components/ContactForm/ContactForm';
import { BRAND } from '../constants';

const CONTACT_CARDS = [
  { icon: HiOutlineMapPin, title: 'Visit Us', text: BRAND.address },
  { icon: HiOutlinePhone, title: 'Call Us', text: BRAND.phone },
  { icon: HiOutlineEnvelope, title: 'Email Us', text: BRAND.email },
  { icon: HiOutlineClock, title: 'Care Line Hours', text: 'Available 24/7, every day' },
];

const Contact = () => {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="We're here whenever you need us"
        description="Questions about a bill, a booking, or your care plan? Reach out and a real person will follow up."
      />
      <section className="container-app py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl2 bg-white p-6 text-center shadow-soft dark:bg-darksurface-card"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
                  <Icon className="text-xl" />
                </span>
                <h3 className="mt-3 font-display text-sm font-bold text-ink dark:text-white">{card.title}</h3>
                <p className="mt-1 text-sm text-ink-soft dark:text-white/50">{card.text}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl3 bg-white p-6 shadow-card dark:bg-darksurface-card sm:p-10 lg:col-span-3"
          >
            <h2 className="font-display text-2xl font-extrabold text-ink dark:text-white">Send us a message</h2>
            <p className="mt-2 text-sm text-ink-soft dark:text-white/50">We typically respond within one business day.</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-xl3 shadow-card lg:col-span-2"
          >
            <iframe
              title="MediCare+ location map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-71.06%2C42.34%2C-71.02%2C42.37&layer=mapnik"
              className="h-full min-h-[360px] w-full grayscale"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;
