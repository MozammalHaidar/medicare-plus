import { motion } from 'framer-motion';
import { HiOutlineHeart, HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineUserGroup } from 'react-icons/hi2';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/SectionTitle/SectionTitle';
import CTA from '../components/CTA/CTA';
import { useApiList } from '../hooks/useApi';

const VALUES = [
  { icon: HiOutlineHeart, title: 'Patient First', text: 'Every decision starts with what makes care easier for the person receiving it.' },
  { icon: HiOutlineShieldCheck, title: 'Rigorous Trust', text: 'Every physician is credentialed, reviewed, and held to the same clinical bar.' },
  { icon: HiOutlineSparkles, title: 'Thoughtful Design', text: 'Healthcare software should feel calm, not clinical in the cold sense.' },
  { icon: HiOutlineUserGroup, title: 'Real Access', text: 'Same-day options for the visits that cannot wait two weeks.' },
];

const About = () => {
  const { data: doctors } = useApiList('/doctors/', { ordering: '-rating_avg' });

  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Built by clinicians, designed for patients"
        description="MediCare+ started as a simple question: why does getting care take longer than the care itself?"
      />

      <section className="container-app py-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.img
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&q=80"
            alt="Care team reviewing patient charts together"
            className="rounded-xl3 shadow-card"
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
              Our Mission
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-ink dark:text-white">
              Coordinated care, without the runaround
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft dark:text-white/60">
              We founded MediCare+ after watching too many patients bounce between phone trees, fax machines, and
              disconnected portals. Today the platform connects over 240 specialists across 40 partner clinics,
              all sharing one secure record — so your care team always knows where you left off.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-soft dark:text-white/60">
              Whether it's a same-day video consult or a scheduled in-person procedure, the goal is the same: get
              you the right care, quickly, without losing the parts of medicine that require a human touch.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-darksurface-raised">
        <div className="container-app">
          <SectionTitle eyebrow="What We Stand For" title="The values behind every feature" />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="rounded-xl2 bg-surface-muted p-6 dark:bg-darksurface-card"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl2 bg-grad-primary text-white">
                    <Icon className="text-2xl" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink dark:text-white">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-white/50">{value.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-app py-16">
        <SectionTitle eyebrow="Leadership in Care" title="A few of the physicians guiding our standards" />
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {doctors.slice(0, 4).map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <img
                src={doc.image || `https://i.pravatar.cc/200?img=${(doc.id % 70) + 1}`}
                alt={doc.name}
                className="mx-auto h-24 w-24 rounded-full object-cover shadow-soft"
              />
              <p className="mt-3 font-display text-sm font-bold text-ink dark:text-white">{doc.name}</p>
              <p className="text-xs text-ink-soft dark:text-white/50">{doc.specialty_name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="pb-20">
        <CTA title="Join thousands of patients who switched" description="See why coordinated, same-day care is worth the switch." />
      </div>
    </>
  );
};

export default About;
