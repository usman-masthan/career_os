# Deployment

CareerOS is deployed as two services: the Next.js app in `frontend/` and the Express API in `backend/`. Apply the versioned migrations in `backend/supabase/migrations/` before enabling database-backed content.

## Frontend environment

Set these in the frontend host and redeploy after changing them (variables prefixed with `NEXT_PUBLIC_` are embedded in the client bundle):

- `NEXT_PUBLIC_API_URL`: public, absolute API base including `/api`, for example `https://api.example.com/api`.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL used by the admin sign-in flow.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key. RLS must remain enabled; never put the service-role key in the frontend.

The public homepage caches each API dataset independently for five minutes. If the API or Supabase is temporarily unavailable, identity content, selected projects, and core skills use checked-in curated defaults; genuinely empty optional datasets render an explanatory empty state.

## Backend environment

Set these only on the backend service:

- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_ANON_KEY`: anonymous key used for public, RLS-constrained reads.
- `SUPABASE_SERVICE_ROLE_KEY`: secret server-only key used by evidence aggregation. Never expose or log it.
- `FRONTEND_URL`: canonical frontend origin allowed by CORS.
- `DEVELOPMENT_ORIGINS`: optional comma-separated additional origins.
- `PORTFOLIO_OWNER_EMAILS`: comma-separated owner accounts allowed to administer content.
- `PORT`: optional HTTP port (defaults to `5000`).

Use `frontend/.env.example` and `backend/.env.example` as local templates. Do not commit real secrets.
