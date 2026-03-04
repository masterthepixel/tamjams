# Story 02: Add Oatmeal Theme CSS & Fonts (with Backward Compatibility)

**Goal:** Integrate the olive colour palette and typography into the global stylesheet while maintaining compatibility with the existing Medusa UI during the transition.

## Tasks

1. In `src/styles/globals.css`, replace the old `@import` statements (base, components, utilities) with the single v4 import:
   ```css
   @import "tailwindcss";
   @config "../../tailwind.config.js"; /* Critical to keep @medusajs/ui functional! */
   ```
2. Below the `@import`, add the `@theme` and `@layer base` block copied from `reference/oatmeal-olive-instrument/tailwind.css`. This injects the new design tokens like `--font-sans`, `--font-display`, and all the `--color-olive-*` variables.
3. In `src/app/layout.tsx`, set up Next.js font optimization using `next/font/google`. Import `Inter` and `Instrument_Serif`, and map them to their respective CSS variables defined in the `@theme` block.
4. Add a quick sanity check (e.g. `<div className="bg-olive-500 font-display">Test</div>`) to confirm the theme variables and fonts work.

## Acceptance Criteria

* `globals.css` successfully bridges Tailwind v4 (`@theme`) with the legacy Medusa v3 config (`@config "../../tailwind.config.js"`).
* Google Fonts are loaded efficiently via `next/font/google` in the root layout.
* Old Medusa styles and the new Oatmeal palette exist harmoniously without build errors.

---

This ensures the app doesn't break while we gradually swap out old components.