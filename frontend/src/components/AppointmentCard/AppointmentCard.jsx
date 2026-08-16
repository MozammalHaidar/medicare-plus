import { motion } from 'framer-motion';

const AppointmentCard = ({ step, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="relative flex flex-col gap-4 rounded-xl2 bg-white p-6 shadow-soft dark:bg-darksurface-card"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-grad-primary font-display text-sm font-extrabold text-white">
          {String(step.number).padStart(2, '0')}
        </span>
        <h3 className="font-display text-base font-bold text-ink dark:text-white">{step.title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-ink-soft dark:text-white/50">{step.description}</p>
    </motion.div>
  );
};

export default AppointmentCard;
