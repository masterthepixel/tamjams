# Feature Epic: Frontend Redesign Using Oatmeal Tailwind Plus Kit

## Goal
Refactor the TamsJam storefront UI so that every page, component, and layout
follows the design language established in the `reference/oatmeal-olive-instrument`
repo.  This means adopting the olive colour palette, Instrument Serif/Inter
typography, and replacing existing UI elements with the prebuilt Elements
components and marketing sections from Oatmeal.

The end result should look and feel like the reference kit but still behave as a
rich Jam storefront (product listings, cart, checkout, etc.).

---

## Background
The reference project is a Tailwind‑Plus marketing template with:

* OKLCH olive palette defined via CSS custom properties
* Global font variables for Instrument Serif (display) and Inter (sans)
* A huge library of `components/elements/*`, `components/sections/*`, and
  SVG icons
* Demo pages using those sections (home, pricing, about, etc.)
* Dependencies on `tailwindcss@^4`, `clsx`, and `@tailwindplus/elements`

A previous subagent review summarised the system; it’s suitable for adoption
alongside or instead of the current `@medusajs/ui` styling.

---

## User Stories

1. **As a designer**, I can apply the olive colour palette and font stack to all
   pages so the site looks cohesive with the Oatmeal brand.

2. **As a developer**, I can install the Tailwind Plus dependencies and import
   the `components/` directory from the reference repo so I don't have to
   recreate UI primitives.

3. **As a UX engineer**, I can swap existing navigation, hero, and marketing
   sections with their Oatmeal equivalents while preserving dynamic data
   (product names, prices, etc.).

4. **As a team**, we can gradually convert pages; the conversion epic allows
tasks to be split by page/feature.

5. **As a user**, I see a polished, modern marketing site that matches the
   provided design reference and works responsively across devices.

---

## Technical Tasks

### Setup
- Install dependencies:
  ```bash
  pnpm install clsx @tailwindplus/elements@latest
  ```
- Add the Oatmeal theme CSS (see `reference/.../tailwind.css`) to
  `src/styles/globals.css` or equivalent; include the font `<link>` tags in
  `app/head.tsx`.
- Configure `tsconfig.json`/`jsconfig.json` paths: `"@/*": ["./src/*"]`.

### Design tokens
- Extend `tailwind.config.js` with olive colour variables or use the
  `@theme` CSS variables and reference them (`bg-[color:var(--color-olive-500)]`).
- Ensure dark mode toggles background to `olive-950` and text colours adapt.

### Component migration
- Copy `reference/oatmeal-olive-instrument/components/elements` and
  `components/sections` and `components/icons` into `src/components/oatmeal/`.
- Audit each existing `src/modules/*` component and decide replacement:
  * Buttons → use `oatmeal/elements/button` variants or re‑wrap
  * Navbar → swap for `NavbarWithLinksActionsAndCenteredLogo` or build custom
  * Footers, forms, modal dialogs, etc. should use the Elements collection
- Replace `ImageGallery`, product cards, etc., with styled equivalents or
  apply the new Tailwind classes to them.

### Page migration
- Create new layout pages under `src/app/[countryCode]/(main)` mirroring the
  reference sample pages (`home-01`, `about-01`, etc.) using Oatmeal sections.
- Migrate product listing and product detail pages to use the new palette and
  typography; you may not need the marketing sections, but colors/fonts should
  match.
- Ensure the checkout pages and account pages follow the same style (buttons,
  headings, inputs).

### Routing/links
- Optionally replace `<a>` tags in copied components with Next.js `<Link>` or
  the app’s router equivalent.

### Tests & validation
- Add a new “theme sanity” storybook or test page that renders a handful of
  sections to confirm the styling
- Update any Jest/Playwright tests that relied on old CSS classes (e.g. button
  selectors) to match the new ones.

### Cleanup
- Gradually remove `@medusajs/ui` imports once components are migrated.
- Delete or refactor legacy CSS utilities that conflict with the new theme.

### Documentation
- Update `DOCS/IMPLEMENTATION_GUIDE.md` and `AGENTS.md` to include the new
  style instructions and how to use Oatmeal components.
- Add a reference section explaining the `reference/` repo and how to update it.

---

## Acceptance Criteria

- The homepage, product pages, cart, and checkout all use the olive palette and
  Oatmeal typography.
- Core UI elements (buttons, inputs, navbars) are drawn from the imported
  Elements library or styled to match it.
- New dependency versions are added to `package.json` and build passes.
- The app functions exactly as before (product flows unchanged) but with the
  redesigned look.
- Documentation clearly guides developers on how to use and extend the
  imported components.

---

## Migration Strategy & Risk Management
1. **Rollback & Branching Strategy:** Work will be contained in an `epic/oatmeal-redesign` branch to prevent polluting `main`. Individual stories branch off the epic branch. Rollback means reverting or discarding the epic branch.
2. **"Definition of Done" for Page Migrations:**
   - Visual parity with the reference repo template.
   - Responsive checks pass on mobile, tablet, and desktop.
   - Accessibility (a11y) scans pass (keyboard navigation, ARIA labels).
   - Core Medusa functionalities (adding to cart, checkout) are successfully verified against the manual test checklist. 
3. **Prototype** – build a single page (e.g. homepage) using Oatmeal sections and verify the new theme renders correctly.
4. **Incremental** – convert one UI component at a time, starting with global elements (buttons, headings) and then layout structures.
5. **Fallback** – keep both theme styles alive during transition; use CSS scope or Tailwind v4's backward compatibility (`@config`) to bridge the v3 and v4 configs.
6. **Medusa UI Removal Timeline** – Legacy `@medusajs/ui` dependencies won't be fully removed until all core pages (Home, PlP, PDP, Cart, Checkout) are fully migrated, tested, and shipped. This prevents blocking checkout flows.
7. **Reference Repo DRI:** A Directly Responsible Individual should be assigned to monitor updates or bug fixes in `reference/oatmeal-olive-instrument` to determine if we need to sync upstream changes.

This epic provides the roadmap for a wholesale restyling of the storefront
using the reference kit’s well‑crafted Tailwind Plus components.  It allows
multiple developers to work in parallel on different pages or modules while
maintaining visual consistency.