# Story 14: Update Documentation for Oatmeal Style Usage

**Goal:** Ensure all project documentation reflects the newly adopted
Oatmeal/Tailwind‑Plus design system and instructs future developers how to use
it.

## Tasks

1. Add a section in `DOCS/README.md` or `IMPLEMENTATION_GUIDE.md` titled
   "Using the Oatmeal Design System" explaining:
   * dependencies to install (`clsx`, `@tailwindplus/elements`)
   * global CSS snippets to include (theme variables, fonts)
   * path alias configuration
   * how to copy new components from `reference/` or update them.
2. Reference the new stories in the Features directory and link to
   `docs/stories/*` from the epic file.
3. Update `AGENTS.md` with a note that frontend development now uses the
   Oatmeal UI kit and that any new components should follow its conventions.
4. Document the `reference/` repo – explain that it contains a tailwind-plus
   template and how to refresh it (manually copy or convert to a submodule).
5. If you created a style‑guide or sandbox page as part of earlier stories,
   add instructions on how to run and extend it.
6. Commit all documentation changes and optionally add a changelog entry.

## Acceptance Criteria

* Documentation files clearly describe the new design system and steps to
  use it.
* Links between epic, stories, and reference repo exist so developers can
  navigate easily.
* No documentation refers to outdated UI packages or class names.
* New team members following the README can get a working Oatmeal‑styled
  environment with minimal guidance.

---

This final story ensures that the knowledge transfer is complete and future
developers are equipped to maintain the redesigned storefront.