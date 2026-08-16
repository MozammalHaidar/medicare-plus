# MediCare+

A full-stack healthcare & appointment booking platform — React frontend, Django REST Framework backend.

<!--
  Replace YOUR_USERNAME/YOUR_REPO below once this is pushed to GitHub,
  so the badges actually point at your repo's workflow runs.
-->
[![Backend CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/frontend-ci.yml)

```
medicare-plus/
├── .github/workflows/   backend-ci.yml, frontend-ci.yml
├── frontend/            React (Vite) + Tailwind CSS + Framer Motion
└── backend/             Django REST Framework + PostgreSQL/SQLite + JWT auth
```

Each half has its own README with full setup details — start there:

- [`frontend/README.md`](./frontend/README.md)
- [`backend/README.md`](./backend/README.md)

## Quick Start

Run both from the `medicare-plus/` root, in two separate terminals.

**Terminal 1 — backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo_data
python manage.py runserver
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

- App: `http://localhost:5173`
- API: `http://127.0.0.1:8000/api/v1/`
- API docs (Swagger): `http://127.0.0.1:8000/api/v1/docs/`
- Django admin: `http://127.0.0.1:8000/admin/`

## What's Included

- **Auth** — JWT registration/login/logout, silent token refresh, protected routes
- **Patient dashboard** — view upcoming/past appointments, cancel a booking
- **Appointment booking** — real-time availability validation, no double-booking (enforced at the database level)
- **Content** — doctors, specialties, services, blog, testimonials, FAQ — all admin-manageable and cached for performance
- **Tests** — 30 backend tests covering the booking and auth flows (`cd backend && python manage.py test`)
- **CI** — GitHub Actions runs the backend test suite against real Postgres, and builds the frontend, on every push/PR

## Before Deploying

- Rotate any credentials that were ever shared outside your local `.env` (Postgres password, `SECRET_KEY`, etc.)
- Generate a real `SECRET_KEY`: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
- Swap local media storage (`backend/media/`) for S3/R2 or similar — local disk uploads won't survive most redeploys
- Point `DEFAULT_FROM_EMAIL`/`EMAIL_HOST` at a real transactional email provider instead of the console backend
