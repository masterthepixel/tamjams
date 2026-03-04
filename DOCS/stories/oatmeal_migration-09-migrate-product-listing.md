# Story 09: Migrate Product Listing Page

**Goal:** Restyle the product catalog page to use Oatmeal styles while
keeping existing filtering, pagination, and data fetching intact.

## Tasks

1. Open the product listing page component (e.g. `src/modules/store/page.tsx` or
   similar) and note its structure (banner, filters, grid).
2. Replace spine classes and layout wrappers with Oatmeal equivalents such as
   `Container`, `Section`, `Grid`, etc., imported from
   `@/components/oatmeal/elements`.
3. Update the grid items (product cards) to use the new button and typography
   components from the kit.  If necessary, create a new `ProductCard` component
   based on an Oatmeal section or element and inject title/price/image props.
4. Adjust spacing, colours, and text sizes to use `olive-` tokens and the
   `font-display`/`font-sans` families.
5. Ensure filters and pagination controls blend with the new theme (e.g.
   buttons using `SoftButtonLink`).
6. Validate that all data fetching (`listProducts()`) still works and that
   query parameters are preserved.
7. Test the listing page across breakpoints and screen sizes.

## Acceptance Criteria

* Product listing page visually conforms to Oatmeal style (colors, typography,
  spacing).
* The grid of products renders correctly; cards use the new design components.
* Filter controls and pagination are styled using the imported button/link
  elements.
* Functional behaviour (search, sort, filter, pagination navigation) remains
  unchanged.
* No visual regressions on mobile; catalogue remains responsive.

---

This story brings the core browsing experience into the new design language.