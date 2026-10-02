# Environment Workflows and Variables

This project uses two distinct environments defined by `APP_ENV`. Vercel automatically sets `NODE_ENV` to `production` for all deployments (both Preview and Production), so we use `APP_ENV` to differentiate between a safe staging/development environment and the real, live website.

## Environments

| Environment Type | `APP_ENV` | Description |
|---|---|---|
| **Development** | `"development"` | Used for your local machine and Vercel preview/staging deployments. Safe to break, safe to reset the database. Emails are restricted to admin only, S3 uploads go into a `dev/` folder. |
| **Production** | `"production"` | The real live website. Real user data, real emails to users, real S3 storage without prefixes. Safety guards actively prevent destructive seed operations. |

## Variables Table

| Variable | Must Differ? | Description |
|---|---|---|
| `APP_ENV` | **YES** | `"development"` locally and on Vercel preview. `"production"` on Vercel prod. |
| `LOG_ENABLED` | No | Server-side toggle (`"true"` / `"false"`) for the custom boolean logger. |
| `NEXT_PUBLIC_LOG_ENABLED` | No | Client-side toggle (`"true"` / `"false"`) for the custom boolean logger. |
| `POSTGRES_PASSWORD` | No | Only required when running local docker-compose for PostgreSQL. |
| `DATABASE_URL` | **YES** | Local DB URL vs Remote Neon DB URL. |
| `NEXT_PUBLIC_APP_URL` | **YES** | e.g. `http://localhost:3000` vs `https://ingrowwthinnovations.com`. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | **YES** | Clerk dev instance key vs production instance key. |
| `CLERK_SECRET_KEY` | **YES** | Clerk dev instance secret vs production instance secret. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | No | Usually `/admin/sign-in`. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | No | Usually `/admin/sign-up`. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | No | Usually `/admin`. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | No | Usually `/admin`. |
| `RESEND_API_KEY` | Optional | Can share one key or use a different test key. |
| `MAIL_FROM` | No | Verified sending address from Resend. |
| `MAIL_TO_ADMIN` | No | Inbox to receive notification emails. |
| `AWS_ACCESS_KEY_ID` | Optional | Can share the same keys (S3 paths get `dev/` prefixed automatically in dev). |
| `AWS_SECRET_ACCESS_KEY` | Optional | Shared or separate. |
| `AWS_REGION` | No | e.g., `us-east-1`. |
| `AWS_BUCKET_NAME` | Optional | Shared or separate bucket for test assets. |

## How to Run Locally
1. Copy `.env.example` to `.env.local` and fill in real local/development values.
2. Run database dependencies using Docker: `docker-compose up -d postgres`.
3. Apply schema to local DB: `npm run db:migrate:dev`.
4. Start development server: `npm run dev`.

## Toggling Logs
The project uses a boolean-controlled logger (`src/lib/logger.ts`).
To enable or disable all logs globally:
- **Server logs:** Change `LOG_ENABLED` to `"true"` or `"false"`.
- **Client logs:** Change `NEXT_PUBLIC_LOG_ENABLED` to `"true"` or `"false"`.

*Secrets are never logged; they are automatically redacted.*

## How to Deploy (Vercel)
- **Vercel Preview Deployments**: Set `APP_ENV="development"` in your Vercel project's "Preview" environment variables.
- **Vercel Production Deployments**: Set `APP_ENV="production"` in your Vercel project's "Production" environment variables.

## Running Migrations Safely
- **Development**: Use `npm run db:migrate:dev`. It generates the migrations and applies them.
- **Production**: Run `npm run db:migrate:deploy` in your deployment steps.
- Note: Our `docker-compose.yml` only runs migrations on startup if `RUN_MIGRATIONS=true` is set.
