# Story 13: Update Tests for New Styles

**Goal:** Modify or add unit/integration tests so they are compatible with the
new Oatmeal styling and component structure.

## Tasks

1. Identify existing tests that rely on CSS class names, DOM structure, or
   specific components (e.g. looking for `.btn-primary` or `@medusajs/ui`.
2. Update selectors to use the new component names or class names.  Where
   possible, prefer role/ARIA attributes (`getByRole('button', { name: /add to
   cart/i })`) to avoid tight coupling to classes.
3. Add new tests verifying the presence of olive palette classes or the new
   `font-display` usage if that helps detect migration.
4. Add a new snapshot or visual regression test for a page that uses Oatmeal
   sections (e.g. homepage) to catch unintended style drift.
5. Run the full test suite; confirm all tests pass.  Fix any failures caused by
   missing mocks or changed import paths.
6. Update any end‑to‑end or Playwright scripts to account for new selectors
   (e.g. `text=Start free trial` instead of `.button-primary`).

## Acceptance Criteria

* All existing tests pass after updates.
* New tests cover at least one of the redesigned pages/components.
* No test imports reference `@medusajs/ui` or removed components.
* The test suite provides confidence that the redesign did not break core
  functionality.

---

This story ensures the codebase retains automated coverage following the UI
rewrite.