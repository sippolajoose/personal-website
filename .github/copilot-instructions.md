# Project Guidelines

## Project and UI

- This is a personal portfolio. Keep the portfolio and its projects primary; treat technical demos as secondary.
- Preserve the warm light palette and keep dark mode cohesive with the site's navy surface colors. Use the CSS tokens in `frontend/src/styles.css` and keep Naive UI theme overrides aligned with them.
- Maintain clear surface hierarchy and readable contrast in both themes. Avoid introducing unrelated accent colors or decorative labels that look interactive but are not.
- Do not add a contact call-to-action unless requested. Keep visible navigation items actionable.

## Frontend Conventions

- Use Vue 3 Composition API with `<script setup lang="ts">` and follow existing component and composable patterns.
- Keep components focused. Move feature-specific state and behavior out of the app shell when it becomes substantial.
- Put user-facing strings in both `frontend/src/i18n/fi.ts` and `frontend/src/i18n/en.ts`; do not hardcode interface copy in templates.
- Prefer small, focused changes that preserve existing behavior. Avoid unrelated redesigns, abstractions, or dependencies.

## Validation

- For frontend changes, run `npm run build --workspace=@site/frontend`.
- Check formatting of changed frontend files with `npm exec prettier -- --check <files>`.
- For visual changes, check both themes and desktop/mobile layouts in a browser preview when available.
