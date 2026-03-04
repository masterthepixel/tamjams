# Story 10: Migrate Product Detail Page

**Goal:** Apply the Oatmeal design system to the product detail page (PDP)
while preserving the product data, gallery, and add‑to‑cart functionality.

## Tasks

1. Locate the PDP component, typically `src/app/[countryCode]/(main)/products/[handle]/page.tsx`.
2. Update layout wrappers (e.g. `<Container>`, `<Grid>`) to use Oatmeal elements
   and adjust column counts for better spacing.
3. Replace any typography (h1, p, labels) with the new heading/text
   components or relevant classes.
4. Restyle the `ImageGallery`/`MediaGallery` container so it matches the kit’s
   image styling (rounded corners, shadows, etc.).  If necessary create a thin
   wrapper that adds Oatmeal-specific classes around the existing gallery.
5. Use Oatmeal buttons for quantity selectors and add‑to‑cart actions.  Ensure
   interactive states (hover, disabled) follow the new palette.
6. Update the metadata sections (ingredients, nutrition) with Oatmeal
   typography and spacing.  You may use a section component like
   `FeaturesTwoColumnWithDemos` repurposed for specs.
7. Verify functionality: product variant switching, cart addition, dynamic price
   updates all behave as before.
8. Check responsive behaviour and adjust breakpoints if the layout shifts
   awkwardly.

## Acceptance Criteria

* PDP renders with the olive palette and new fonts.
* Media gallery sits within an Oatmeal-styled container.
* All buttons/links on the page use the imported components and look correct.
* Product details, descriptions and specs maintain readability and structure.
* The page remains functional — no regressions in variant selection or cart
  integration.
* Page matches reference design’s spacing and typography when compared side by
  side.

---

This story ensures the most important conversion flow (viewing a product) is
aligned with the new visual identity.