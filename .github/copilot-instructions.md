# Project Guidelines

## Project and UI

- This is a personal portfolio. Keep the portfolio and its projects primary; treat technical demos as secondary.
- Preserve the warm light palette and keep dark mode cohesive with the site's navy surface colors. Use the CSS tokens in `frontend/src/styles.css` and keep Naive UI theme overrides aligned with them.
- Maintain clear surface hierarchy and readable contrast in both themes. Avoid introducing unrelated accent colors or decorative labels that look interactive but are not.
- Do not add a contact call-to-action unless requested. Keep visible navigation items actionable.

## Frontend Conventions

- Use Vue 3 Composition API with `<script setup lang="ts">` and follow existing component and composable patterns.
- Keep components focused. Move feature-specific state and behavior out of the app shell when it becomes substantial.
- Keep frontend tests beside their implementation files, using the matching `<name>.test.ts` naming convention.
- Put user-facing strings in both `frontend/src/i18n/fi.ts` and `frontend/src/i18n/en.ts`; do not hardcode interface copy in templates.
- Prefer small, focused changes that preserve existing behavior. Avoid unrelated redesigns, abstractions, or dependencies.

## Backend Conventions

- Use the existing TypeScript, Express 5, Zod, and MongoDB driver stack; avoid adding frameworks or abstractions without a clear need.
- Keep HTTP handling in `backend/src/routes/`, business logic in `backend/src/services/`, and database access in `backend/src/repositories/`. Use `backend/src/db/mongo.ts` for database connections.
- Validate environment variables and untrusted request data with Zod. Derive input types from schemas where practical; do not trust raw `request.body`.
- Keep API responses and HTTP status codes explicit. Forward route errors to the central error handler, and never expose internal error or database details in client responses.
- Use typed MongoDB collections and bounded, explicit queries and projections. Add tests for changed API behavior, including relevant validation and failure cases.
- Follow the existing Vitest and Supertest pattern for route tests; mock database access so routine tests do not require a live MongoDB instance.

## Validation

- For frontend changes, run `npm run build --workspace=@site/frontend`.
- For frontend tests, run `npm run test --workspace=@site/frontend`; root `npm test` runs both backend and frontend suites.
- Check formatting of changed frontend files with `npm exec prettier -- --check <files>`.
- For visual changes, check both themes and desktop/mobile layouts in a browser preview when available.
- For backend changes, run `npm run typecheck --workspace=@site/backend` and `npm test --workspace=@site/backend`.
