# CareerOS frontend

For full-system setup and architecture, start with the repository [`README.md`](../README.md). Detailed technical documentation is indexed in [`docs/README.md`](../docs/README.md).

CareerOS is a living professional record that connects projects, skills, evidence, credentials, research, and writing. This directory contains its [Next.js](https://nextjs.org) web application. The Express API in `../backend/` provides the application boundary, while Supabase provides PostgreSQL persistence, row-level authorization, and admin authentication.

The database contract lives in `../supabase/migrations/`. Apply those migrations in filename order rather than creating framework-specific model files.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Copy `.env.example` to `.env.local` and configure the public API and Supabase values before testing authentication or live content. Open [http://localhost:3000](http://localhost:3000) to view CareerOS.

## Architecture

- **Product:** CareerOS
- **Web:** Next.js and React
- **API:** Express
- **Persistence and authentication:** Supabase (PostgreSQL, Auth, and row-level security)
- **Database contract:** versioned SQL in `../supabase/migrations/`

## Deployment

See [`../DEPLOYMENT.md`](../DEPLOYMENT.md) for environment variables, migration order, and service deployment guidance.
