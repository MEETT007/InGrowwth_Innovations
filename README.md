# InGrowwth Innovations - Next.js Enterprise Web Platform

This is a premium, modern Next.js 15 enterprise web platform for InGrowwth Innovations. It leverages React 19, Tailwind CSS, Prisma 7, PostgreSQL, and Docker.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v20+ recommended)
- **Docker Desktop**
- **Git**

### 2. Environment Configuration

Copy the environment template file:

```bash
cp .env.example .env
```

Fill in the values in `.env` as required.

### 3. Start Local Development

To run the application locally in development mode:

1. Start the PostgreSQL database:
   ```bash
   docker compose up postgres -d
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🐳 Docker Production Environment Setup

Our Docker Compose configuration builds and runs a **production replica** locally.

### Start the production environment

This command builds the Next.js frontend for production (on `http://localhost:3000`) and starts the PostgreSQL database (mapped to host port `5435`):

```bash
docker compose up --build -d
```

### Stop the environment

To shut down containers and free up ports:

```bash
docker compose down
```

### Reset the local database

To wipe all local tables, volumes, and start with a clean database:

```bash
docker compose down -v
docker compose up postgres -d
```

---

## 📐 Prisma 7 Database Architecture

Prisma 7 has moved connection URLs out of `schema.prisma` into a configuration file (`prisma.config.ts`).

### Key Prisma Commands

- **Validate Schema:**
  ```bash
  npx prisma validate
  ```
- **Generate Client:**
  ```bash
  npx prisma generate
  ```
- **Create a New Migration (Local):**
  Apply schema changes, generate client, and apply changes to your local PostgreSQL container:
  ```bash
  npx prisma migrate dev --name <migration_name>
  ```
- **Deploy Migrations (Production/CI):**
  Apply migrations without prompts:
  ```bash
  npx prisma migrate deploy
  ```
- **Launch Prisma Studio:**
  Browse your database records in a GUI:
  ```bash
  npx prisma studio --port 51212
  ```

---

## ⚡ Production Deployment (Neon PostgreSQL + Vercel)

1. **Neon Database Setup:**
   - Create a project on [Neon.tech](https://neon.tech/) and provision a PostgreSQL database.
   - Add the Neon connection string to Vercel's Environment Variables as `DATABASE_URL`.
2. **Vercel Migration Integration:**
   Update your Vercel build command to ensure migrations are run before Next.js builds:
   `prisma generate && prisma migrate deploy && next build`

---

## 🧪 Health check & Verification

### Health API Endpoint

Once started, you can verify the status of the Next.js server and database connection:

```bash
curl http://localhost:3000/api/health
```

Response format:

```json
{
  "status": "UP",
  "timestamp": "2026-07-19T19:25:44Z",
  "version": "0.1.0",
  "environment": "development",
  "checks": {
    "database": {
      "status": "UP"
    },
    "env": {
      "DATABASE_URL": "LOADED",
      "NEXT_PUBLIC_APP_URL": "LOADED"
    }
  }
}
```

---

## 🛠 Troubleshooting

- **Authentication failed against database server (P1000):**
  - Check if port `5432` or `5435` is already in use by a native PostgreSQL server on your host machine.
  - Ensure `.env` is updated to point to `localhost:5435` (Docker mapped port) rather than `5432` if native PostgreSQL is running.
- **Prisma schema validation errors:**
  - In Prisma 7, do not include `url = env("DATABASE_URL")` inside `schema.prisma`. It must reside in `prisma.config.ts`.
