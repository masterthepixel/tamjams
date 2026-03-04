# Story 12: Replace Anchor Links with SPA Link Component

**Goal:** Modify the copied Oatmeal components so that their `<a>` tags use the
project’s SPA link component (Next.js `Link` or equivalent) to prevent full page
navigations.

## Tasks

1. Search the `src/components/oatmeal` directory for `<a` tags.
2. Create a new wrapper component (if not already present) or modify existing
   `Link` component under `oatmeal/elements` to render the app’s router link.
   Example for Next.js: replace `<a>` with `<NextLink href={href}><a>…`.
3. Update imports in all affected components to use the new wrapper.
4. Verify that tooltips, `target=_blank`, and external links still behave
   correctly (you may need to detect external URLs and render plain `<a>` for
   those).
5. Run the dev server and manually click through the site to confirm client‑side
   routing works and no hard reloads occur.
6. Adjust tests that asserted on `<a>` elements to account for the wrapper or
   the router link component.

## Acceptance Criteria

* No `<a>` tags remain in the code that cause full page reloads for internal
  navigation.
* Internal links navigate via the router (`next/link`, etc.) without reload.
* External links still open new tabs when `target="_blank"` is specified.
* Navigation behaviour is consistent across all pages (homepage, listing,
  product, etc.).
* Automated tests reflect the new link structure and continue to pass.

---

This story finalizes the interactive behaviour of the migrated components.