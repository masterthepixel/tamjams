# Story 06: Refactor Buttons & Typography

**Goal:** Replace or restyle all existing button components and typographic
styles with the Oatmeal versions so the UI elements match the new design
language.

## Tasks

1. Search the frontend code for any custom button components or usages of
   Tailwind classes for buttons (`bg-ui-primary`, etc.). Create an inventory.
2. Import `ButtonLink`, `PlainButtonLink`, `SoftButtonLink` from the new
   `@/components/oatmeal/elements/button` path.
3. Replace existing `<button>`/`<a>` usages with the appropriate Oatmeal
   component. Adjust props (size, variant) as needed.
4. Update global typography utility classes:
   * Use `font-display` for headings and `font-sans` for body text.
   * Replace any hardcoded `text-lg`/`tracking-tight` values with Oatmeal
     recommended classes if they differ.
5. Review form inputs, labels, and headings – align them with the kit's
   typographic scale by copying the corresponding element components
   (`heading.tsx`, `text.tsx`, etc.) and using them everywhere.
6. Run the app and visually inspect several pages to ensure button colours,
   sizes and text styles match the reference.

## Acceptance Criteria

* There are no remaining references to the old `@medusajs/ui` button exports
  in component files (search for `@medusajs/ui` and confirm removal).
* Buttons render using the new olive palette and the icon spacing is correct.
* All headings on pages use the `Heading` component or appropriate classes
  from the new kit.
* Typography matches the reference sample (use the demo home page as a guide).
* Automated tests that looked for old class names have been updated.

---

This story standardizes the most visible UI elements and prepares the ground
for migrating larger page layouts.