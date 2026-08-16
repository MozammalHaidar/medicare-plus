import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2';
import { NAV_LINKS, BRAND, SOCIAL_LINKS } from '../../constants';
import { useApiList } from '../../hooks/useApi';
import VitalLine from '../shared/VitalLine';

const Footer = () => {
  const { data: specialties } = useApiList('/specialties/');

  return (
    <footer className="border-t border-primary-100/60 bg-white dark:border-white/10 dark:bg-darksurface-raised">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-grad-primary text-white">
                <HiOutlineHeart className="text-lg" />
              </span>
              <span className="font-display text-lg font-extrabold text-primary-600 dark:text-white">{BRAND.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft dark:text-white/50">
              {BRAND.tagline}. Board-certified care, telemedicine, and at-home visits — coordinated in one platform.
            </p>
            <VitalLine width={140} className="mt-6" />
            <div className="mt-6 flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600 transition-colors hover:bg-grad-primary hover:text-white dark:bg-white/5 dark:text-white/70"
                >
                  {s.label[0]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink dark:text-white">Navigate</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-ink-soft transition-colors hover:text-teal-600 dark:text-white/50 dark:hover:text-teal-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink dark:text-white">Specialties</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {specialties.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link to={`/doctors?specialty=${s.slug}`} className="text-sm text-ink-soft transition-colors hover:text-teal-600 dark:text-white/50 dark:hover:text-teal-300">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink dark:text-white">Contact</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-ink-soft dark:text-white/50">
              <li className="flex items-start gap-2">
                <HiOutlineMapPin className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-300" />
                {BRAND.address}
              </li>
              <li className="flex items-center gap-2">
                <HiOutlinePhone className="shrink-0 text-teal-600 dark:text-teal-300" />
                {BRAND.phone}
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineEnvelope className="shrink-0 text-teal-600 dark:text-teal-300" />
                {BRAND.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-primary-100/60 pt-8 text-xs text-ink-soft dark:border-white/10 dark:text-white/40 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-teal-600 dark:hover:text-teal-300">Privacy Policy</a>
            <a href="#" className="hover:text-teal-600 dark:hover:text-teal-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
