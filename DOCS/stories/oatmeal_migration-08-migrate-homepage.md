# Story 08: Migrate Homepage to Oatmeal Sections

**Goal:** Rebuild the storefront homepage using the Oatmeal marketing section
components, while plugging in dynamic content where necessary.

*Note: This is a high-scope story. To prevent scope creep, break this down into smaller sub-tasks or PRs during execution (e.g. Hero Section, Featured Categories, Testimonials) if it becomes too large. Validation must be checked against the Story 00 test baseline.*

## Tasks

1. Identify current homepage file (likely `src/app/[countryCode]/(main)/page.tsx`)
   and note existing sections (hero, featured products, etc.).
2. Create a new temporary homepage component using a series of Oatmeal
   sections, e.g. `HeroLeftAlignedWithDemo`, `FeaturesTwoColumnWithDemos`,
   `StatsWithGraph`, `CallToActionSimple`, etc. Refer to the `home-01.tsx`
   sample in the reference repo for layout.
3. Replace static text with our copy and remove irrelevant demo screenshots.
   Use existing image assets or swap in product gallery components as needed.
4. Integrate dynamic pieces: e.g. map over featured products to render a
   custom grid inside a section, or embed the `ProductGallery` component if
   appropriate.
5. Ensure the homepage respects multi‑region routing and uses `getProducts()`
   data hooks as before.
6. Add SCSS/utility overrides if a section requires slight modification
   (e.g. change the background colour).  Use the new theme tokens instead of
   hardcoded colours.
7. Delete or archive the old homepage layout once the new one is verified.

## Acceptance Criteria

* Visiting `/us` (or equivalent) shows the newly styled homepage.
* The header, hero, features, and CTAs all use Oatmeal components and olive
  palette.
* Dynamic content (product listings, blog links, etc.) continues to load.
* The page is responsive and matches the look of `home-01` in the reference
  project.
* Performance (build time, hydration) remains acceptable.

---

This story establishes a pattern for converting subsequent pages by
replacing static markup with section components while reusing our data logic.