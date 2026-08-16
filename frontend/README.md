# MediCare+ — Modern Healthcare & Appointment Platform

A production-ready, frontend-only healthcare & appointment platform built with **React (Vite)**, **Tailwind CSS**, **Framer Motion**, **React Router DOM**, and **React Icons**. Built as a portfolio piece demonstrating senior-level frontend architecture, motion design, and accessibility.

## Design System

- **Palette** — clinical indigo-blue (`primary`) paired with a medical teal accent (`teal`), sky and emerald as supporting accents. Full light/dark scale defined in `tailwind.config.js`.
- **Typography** — Plus Jakarta Sans (display/headings) + Manrope (body).
- **Signature motif** — the "Vital Line," an animated ECG-style pulse line (`src/components/shared/VitalLine.jsx`) used as a recurring section divider, in the hero, the loader, and the 404 page.

## Tech Stack

- React 18 (functional components, hooks)
- Vite
- Tailwind CSS v3 (dark mode via `class` strategy, persisted to `localStorage`)
- Framer Motion (page transitions, scroll reveals, micro-interactions)
- React Router DOM v6 (lazy-loaded routes, animated transitions)
- React Icons (`hi2` outline set)

## Getting Started

```bash
npm install
npm run dev       # start local dev server
npm run build      # production build to /dist
npm run preview    # preview the production build
```

## Folder Structure

```
src/
  components/   # 25+ reusable, single-responsibility components
  pages/        # Home, Doctors, Specialties, Appointment, Services, Blog, BlogPost,
                # About, Contact, Login, Register, Profile, MyAppointments, NotFound
  hooks/        # useScrollPosition, useClickOutside, useInView, useCountUp,
                # useApi (list/detail fetching), useDebouncedValue
  context/      # ThemeContext (dark/light mode), AuthContext (JWT session)
  utils/        # api.js (fetch client + token lifecycle), iconMap, formatDate, formatTime
  constants/    # nav links, brand info, social links
```

## Auth

`AuthContext` (`src/context/AuthContext.jsx`) handles the full session lifecycle against the backend's JWT endpoints: register (auto-logs in right after), login, logout, profile updates, password changes. Token handling lives in `src/utils/api.js`:

- Access token (30 min) in `sessionStorage`; refresh token (7 days) in `localStorage`, so closing the browser doesn't log you out.
- A 401 on an authenticated request triggers one silent refresh-and-retry automatically — concurrent 401s share a single in-flight refresh rather than each firing their own.
- `/profile` and `/appointments` are wrapped in `ProtectedRoute`, which redirects to `/login` and remembers where you were headed.

## Patient Dashboard

`/appointments` (`src/pages/MyAppointments.jsx`) lists the logged-in patient's bookings, split into Upcoming and Past/Cancelled tabs, with a working cancel action (`POST /appointments/{id}/cancel/`) that updates the list in place without a full refetch.


## Features Implemented

Dark/light mode with persistence · sticky glassmorphism navbar with animated active-pill indicator · animated mobile drawer · scroll-reveal animations · animated statistics counters · JWT authentication (register/login/logout, silent token refresh) · protected routes · patient dashboard with appointment cancellation · appointment booking flow with real-time availability validation · doctor search & specialty filtering · FAQ accordion · testimonial carousel · newsletter subscription · contact form validation · scroll progress bar · back-to-top button · loading screen · lazy-loaded routes & images · page transitions · micro-interactions throughout.

## Backend Integration

This frontend is fully wired to the Django REST Framework backend in `../backend` — see the root `README.md` for running both together. Every page fetches live data via `src/utils/api.js` and the `useApiList`/`useApiDetail` hooks in `src/hooks/useApi.js`; there's no static mock data layer anymore.

`VITE_API_BASE_URL` in `.env` controls which backend it talks to (defaults to `http://127.0.0.1:8000/api/v1`).

## CI

`.github/workflows/frontend-ci.yml` (at the monorepo root) runs `npm ci` + `npm run build` on every push/PR that touches `frontend/`, catching compile errors before they reach `main`.

## Notes

- All imagery is sourced from Unsplash/Pravatar placeholders — swap for licensed assets before production deployment.
- Built and verified with `npm run build` (Vite production build, code-split by route).
