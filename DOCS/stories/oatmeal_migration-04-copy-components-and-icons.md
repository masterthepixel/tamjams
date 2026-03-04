# Story 04: Copy Components & Icons from Reference Repo

**Goal:** Import the UI building blocks from the Oatmeal template into the
front-end workspace so we can begin using them.

## Tasks

1. Inside `reference/oatmeal-olive-instrument/components`, review directory
   structure. There are `elements/`, `sections/`, and `icons/` subfolders.
2. Copy those three folders verbatim into `src/components/oatmeal/` (or
   another chosen namespace). Maintain the same relative hierarchy.
3. Update any import paths within the copied files if they reference `'@/...'
  ` or use local aliases; the path alias configured earlier should handle most
   of them without changes.
4. Remove any demo‑specific code (hard‑coded images/URLs, storybook imports)
   that are not needed in the storefront.
5. Run `pnpm dev` and make sure there are no TypeScript or compilation errors
   from the new components.

## Acceptance Criteria

* `src/components/oatmeal/elements`, `sections`, and `icons` exist with all
  files from the reference project.
* The project builds successfully after copying.
* A quick test import (`import { HeroLeftAlignedWithDemo } from '@/components/oatmeal/sections/hero-left-aligned-with-demo'`) compiles.
* No stray asset imports or unresolved modules remain in the copied code.

---

With the components available, subsequent stories will start using them on
pages.