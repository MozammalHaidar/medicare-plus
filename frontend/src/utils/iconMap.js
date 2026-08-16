import {
  HiOutlineHeart,
  HiOutlineCpuChip,
  HiOutlineFaceSmile,
  HiOutlineHandRaised,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineSun,
  HiOutlineBeaker,
  HiOutlineVideoCamera,
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentCheck,
  HiOutlineTruck,
  HiOutlinePhone,
} from 'react-icons/hi2';

/**
 * The backend stores icons as plain strings (e.g. "HiOutlineHeart") so
 * content stays data-only — no JSX/markup in the database. This maps
 * that string back to a component for rendering.
 *
 * Deliberately an explicit map of *named* imports rather than
 * `import * as Icons from 'react-icons/hi2'` — a wildcard import pulls
 * every icon in the library into the production bundle (~500KB+),
 * since bundlers can't tree-shake a dynamic property lookup. This
 * list covers every icon_key currently seeded on the backend; add a
 * new entry here if a new icon_key is introduced via the admin.
 */
const ICON_MAP = {
  HiOutlineHeart,
  HiOutlineCpuChip,
  HiOutlineFaceSmile,
  HiOutlineHandRaised,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineSun,
  HiOutlineBeaker,
  HiOutlineVideoCamera,
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentCheck,
  HiOutlineTruck,
  HiOutlinePhone,
};

export const resolveIcon = (iconKey) => ICON_MAP[iconKey] || HiOutlineSparkles;
