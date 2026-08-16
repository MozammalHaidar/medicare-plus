import { motion } from 'framer-motion';
import { resolveIcon } from '../../utils/iconMap';

const ServiceCard = ({ service, index = 0 }) => {
  const Icon = resolveIcon(service.icon_key);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="relative overflow-hidden rounded-xl2 bg-white p-7 shadow-soft transition-shadow duration-300 hover:shadow-card dark:bg-darksurface-card"
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal-50 transition-transform duration-500 group-hover:scale-125 dark:bg-teal-500/10" aria-hidden="true" />
      <span className="relative flex h-12 w-12 items-center justify-center rounded-xl2 bg-grad-primary text-white shadow-soft">
        <Icon className="text-2xl" />
      </span>
      <h3 className="relative mt-5 font-display text-lg font-bold text-ink dark:text-white">{service.title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-ink-soft dark:text-white/50">{service.description}</p>
    </motion.div>
  );
};

export default ServiceCard;
