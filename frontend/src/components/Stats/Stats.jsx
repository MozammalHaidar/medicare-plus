import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';

const STATS = [
  { id: 1, value: 240, suffix: '+', label: 'Specialist Doctors' },
  { id: 2, value: 58000, suffix: '+', label: 'Patients Served' },
  { id: 3, value: 40, suffix: '+', label: 'Partner Clinics' },
  { id: 4, value: 98, suffix: '%', label: 'Satisfaction Rate' },
];

const StatItem = ({ value, suffix, label }) => {
  const [ref, inView] = useInView();
  const count = useCountUp(value, { start: inView, duration: 1800 });

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl font-extrabold text-white sm:text-5xl">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-white/70">{label}</p>
    </div>
  );
};

const Stats = () => {
  return (
    <section className="relative overflow-hidden bg-grad-primary py-16">
      <div className="container-app grid grid-cols-2 gap-8 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatItem key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} />
        ))}
      </div>
    </section>
  );
};

export default Stats;
