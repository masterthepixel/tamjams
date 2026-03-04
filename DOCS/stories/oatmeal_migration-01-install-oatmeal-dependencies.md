# Story 01: Install Oatmeal Dependencies & Tailwind v4

**Goal:** Upgrade the project to Next.js-compatible Tailwind v4 and add the Tailwind Plus packages required by the Oatmeal reference design kit.

## Tasks

1. Update the frontend dependencies to Tailwind v4. Run:
   `pnpm add tailwindcss@^4.0.0 @tailwindcss/postcss@^4.0.0 clsx @tailwindplus/elements@latest`
2. Update `postcss.config.js` to use the v4 plugin. It should look like:
   ```javascript
   module.exports = {
     plugins: {
       "@tailwindcss/postcss": {},
     },
   }
   ```
3. Run `pnpm install` then `pnpm dev` to test. Since we haven't updated the CSS imports yet, you might see some dev server warnings. Log any build warnings or deprecations to inform Stories 02–04.
4. After installing dependencies, run the full test suite (or perform the manual checkout/cart checklist defined in Story 00) to catch any immediate Tailwind v4 incompatibilities early.

## Acceptance Criteria

* `tailwindcss` is v4, and `@tailwindcss/postcss`, `clsx`, and `@tailwindplus/elements` appear as dependencies.
* `postcss.config.js` uses `@tailwindcss/postcss`.
* The server starts up, and a baseline test run has passed (or documented expected CSS failures before we fix them in Story 02).

---

This story is a prerequisite for all others in the Oatmeal migration epic.