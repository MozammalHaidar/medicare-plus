# MediCare+ API

Django REST Framework backend for the MediCare+ healthcare & appointment platform.

## Stack & Key Decisions

| Concern | Choice | Why |
|---|---|---|
| Database | PostgreSQL (SQLite fallback for local dev) | Production-grade concurrency/constraints; zero-setup local clone via SQLite when `DATABASE_URL` is unset |
| Auth | JWT (SimpleJWT), rotating refresh tokens, blacklist on logout | Stateless, natural fit for a React SPA |
| Caching | Redis if `REDIS_URL` is set, else local-memory | Static-ish content is list-cached for `CACHE_TTL_SECONDS`; cached querysets deliberately never branch on `request.user` — `cache_page` has no concept of "who's asking," so branching there would leak a cached anonymous response to/from staff |
| API docs | drf-spectacular (OpenAPI + Swagger UI) at `/api/v1/docs/` | Self-documenting |
| Errors | Custom exception handler | Every error response is `{detail, errors, status_code}` |
| Testing | Django's built-in `APITestCase` | No extra dependency; `python manage.py test` runs the full suite |
| CI | GitHub Actions (`.github/workflows/backend-ci.yml`) | Runs checks + full test suite against real Postgres on every push/PR |

## Getting Started

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # works unedited for local dev (SQLite)

python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo_data # optional — populates realistic demo content
python manage.py runserver
```

API root: `http://127.0.0.1:8000/api/v1/`
Swagger UI: `http://127.0.0.1:8000/api/v1/docs/`
Admin: `http://127.0.0.1:8000/admin/`
Health check: `http://127.0.0.1:8000/health/`

### Switching to PostgreSQL

```bash
# .env
DATABASE_URL=postgres://medicareplus_user:password@localhost:5432/medicareplus
```
Then `python manage.py migrate` again.

## Running Tests

```bash
python manage.py test               # full suite
python manage.py test apps.appointments   # one app
python manage.py test --verbosity 2       # see each test name as it runs
```

30 tests cover the two most business-critical flows:

- **`apps/appointments/tests.py`** — booking validation (double-booking rejection, out-of-hours rejection, past-date rejection, guest-vs-authenticated booking), and the full `cancel` permission matrix (owner can cancel their own; a stranger gets a 404, not a 403, so they can't even confirm the appointment exists; staff can cancel anything; an already-cancelled or completed appointment can't be re-cancelled; a patient cannot use `status_update` to confirm their own visit).
- **`apps/accounts/tests.py`** — registration validation, login, protected profile access, the read-only `role` field can't be self-promoted via PATCH, and the JWT refresh/rotation/blacklist lifecycle (a used-and-rotated refresh token is correctly rejected on reuse; logout blacklists it immediately).

## CI

Two GitHub Actions workflows live at the repo root (`.github/workflows/`), each scoped to only run when its half of the project changes:

- **`backend-ci.yml`** — spins up a real Postgres service container, installs dependencies, runs `manage.py check`, checks for missing migrations (`makemigrations --check --dry-run`), then runs the full test suite.
- **`frontend-ci.yml`** — installs with `npm ci` and runs `npm run build`, catching compile errors before they reach `main`.

Both run automatically on every push and pull request to `main`.

## Project Layout

```
core/                  settings, root urls, pagination, custom exception handler
apps/
  accounts/            custom email-auth User model, JWT views, request-logging middleware
  specialties/          medical departments
  doctors/             doctor profiles, weekly availability, patient reviews (rating auto-aggregated via signal)
  services/            platform services (telemedicine, at-home care, ...)
  appointments/        booking — the core business-logic app (see below)
  testimonials/        curated homepage quotes (distinct from per-doctor reviews)
  blog/                categories + articles, read-time auto-calculated
  faq/                 accordion content
  contact/             contact form submissions + admin notification email
  newsletter/          subscriber capture
```

## Appointments — the interesting part

`Appointment` supports **both** an authenticated booking flow and the anonymous guest flow the frontend also ships with (`patient` is nullable; `guest_name`/`guest_email` are used when there's no session). A booking is validated on three fronts before it's accepted:

1. **Not in the past** — `scheduled_date` must be today or later.
2. **Inside the doctor's actual hours** — checked against `DoctorAvailability` for doctors that have availability configured.
3. **No double-booking** — enforced at the database level via a conditional `UniqueConstraint` on `(doctor, scheduled_date, scheduled_time)` that excludes cancelled appointments, so cancelling a slot correctly frees it back up.

### Two distinct ways to change an appointment's status

- **`POST /appointments/{id}/cancel/`** — the appointment's own patient, its assigned doctor, or staff can call this. It's intentionally the *only* status change a patient can make to their own booking.
- **`PATCH /appointments/{id}/status_update/`** — doctor/staff only, even for the appointment's own patient. Moves a booking through `pending → confirmed → completed`. A patient marking their own visit "confirmed" or "completed" would be a clinical/scheduling judgment call that isn't theirs to make — that's why this is a separate, more restrictive action rather than reusing `cancel`'s ownership check.

Doctor ratings (`Doctor.rating_avg`/`rating_count`) are denormalized and recalculated via a signal whenever a `Review` is created/updated/deleted — doctor list/detail is a hot read path, so the aggregate is computed once at write time instead of on every request.

## Rate Limiting

- Anonymous: 100/min · Authenticated: 300/min (baseline)
- Appointment booking: 20/hour
- Contact form: 5/hour
- Newsletter signup: 10/hour

## Adding Content via /admin/ — Will It Show Up on the Frontend?

Yes, but not always instantly. Specialties, doctors, services, blog articles, testimonials, and FAQs are cached for `CACHE_TTL_SECONDS` (default 300 = 5 minutes). For local development where you want to see admin changes reflected immediately, either set `CACHE_TTL_SECONDS=5` in `.env`, or restart `manage.py runserver` (the local-memory cache clears on restart). Appointments and anything fetched by exact slug/ID are never cached.
