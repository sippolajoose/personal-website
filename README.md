# Personal Website Monorepo

## Prerequisites

- Node.js 24
- npm 10 or newer
- Docker, if you want to run MongoDB locally with `compose.yaml`

## Quick start

1. Initialize git if needed: `git init`
2. Install dependencies: `npm install`
3. Copy environment files:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
4. Start MongoDB: `docker compose up -d`
5. Seed data: `npm run seed`
6. Start development: `npm run dev`

The backend never seeds or overwrites profile data when it starts. To deliberately
replace the local profile with the default test profile, set the confirmation value
and run the seed command while `MONGODB_URI` points to localhost:

- PowerShell: `$env:SEED_CONFIRMATION='I_UNDERSTAND_THIS_REPLACES_LOCAL_PROFILE'; npm run seed`
- cmd.exe: `set SEED_CONFIRMATION=I_UNDERSTAND_THIS_REPLACES_LOCAL_PROFILE && npm run seed`

Seeding is refused for non-local MongoDB URIs.

## Scripts

- `npm run dev` starts backend and frontend together.
- `npm run build` builds both apps.
- `npm run lint` runs ESLint.
- `npm run test` runs backend Jest tests.
- `npm run typecheck` runs TypeScript checks for both apps.
