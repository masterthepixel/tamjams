# Story 05: Verify Theme Coexistence & Resolve CSS Collisions

**Goal:** Ensure the new Oatmeal (Tailwind v4) components and the old Medusa UI components correctly style alongside each other without conflicting.

## Tasks

1. Because we are bridging versions via `@config "../../tailwind.config.js"`, ensure your `postcss.config.js` does NOT contain old v3 plugins (`tailwindcss` or `autoprefixer`) and securely uses `@tailwindcss/postcss`. Verify `@tailwindplus/elements/plugin` is not required to be imported explicitly due to dependencies.
2. Confirm the `tailwind.config.js` `content` paths do not overwrite any generic classes in a mutually destructive way.
3. Test a pre-existing "Medusa UI" dependent module (like the shopping cart or search drawer) on the site. Ensure it opens and maintains its structure (`max-w-[1440px]`, `content-container`, its default Medusa buttons).
4. Render an Oatmeal component on the same page. Ensure the olive colors (`bg-olive-500`) and modern font variables are strictly applied.
5. If there are collisions (e.g. they both heavily modify root `html` or `body` styles), isolate the Oatmeal specifics or slightly scope them if necessary. TamsJam contains some global hacks in `globals.css` (like the `.no-scrollbar` resets and form autofill resets); ensure they don't break the new form designs.

## Acceptance Criteria

* `postcss.config.js` is cleaned up and only exports the new v4 setup.
* Both legacy `@medusajs/ui` components and the newly imported `@tailwindplus/elements` render as designed simultaneously without massive CSS specificity wars.
* Development server builds smoothly without v3/v4 conflict panics.

---

This story validates our bridge setup before embarking on the bulk work of page-by-page component migrations.