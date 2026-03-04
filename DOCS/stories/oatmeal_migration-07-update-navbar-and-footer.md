# Story 07: Update Navbar and Footer

**Goal:** Replace the existing navigation and footer components with the
Oatmeal kit's ready‑made layouts, ensuring links, brand logo, and actions match
our store's structure.

## Tasks

1. Review the navbar and footer implementation in `src/modules/layout/` and
   any shared components.
2. Import `NavbarWithLinksActionsAndCenteredLogo` and relevant `Footer...`
   components from `@/components/oatmeal/sections`.
3. Map our current site links (Products, Cart, Account, etc.) into the kit's
   `links` prop. Update the logo to point to the Jam brand SVG instead of
   the Oatmeal logo; maintain dark/light variations.
4. Ensure mobile behaviour matches (burger menu, collapsible links) and that
   `Log in`/`Cart` actions work as before.
5. Replace the existing footer markup with `FooterWithNewsletterFormCategoriesAndSocialIcons`
   or another suitable variant. Populate categories/links with our actual
   navigation structure.
6. Remove any leftover CSS or components that were specific to the old header
   or footer.

## Acceptance Criteria

* The header and footer visually match the Oatmeal examples when compared to
  the reference pages.
* Navigation links still route correctly to product listing, account pages,
  etc.
* The burger menu functions on small screens.
* The newsletter form (if used) integrates with our signup logic or is removed.
* Tests covering header/footer interactions are updated to reflect the new
  component tree.

---

This story replaces the site’s skeleton with the new design foundation.