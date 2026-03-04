# Story 11: Migrate Cart & Checkout Pages

**Goal:** Restyle the cart and checkout workflows to use Oatmeal components and
colours, ensuring that usability and payment functionality are unaffected.

*Note: This is a high-risk, high-scope story. Do not alter the checkout state machine or logic flow. Validation must be rigorously checked against the checkout and payment test baseline defined in Story 00.*

## Tasks

1. Identify the cart page component (`src/modules/cart/page.tsx` or similar)
   and the checkout steps (`shipping`, `payment`, etc.).
2. Replace layout wrappers with Oatmeal `Container`/`Section` elements and use
   the new button components for actions like "Proceed to checkout" and
   "Place order".
3. Restyle the cart line item list with the olive colour palette, using the
   new `Text`/`Heading` components for item names, quantities, and prices.
4. Ensure input fields (address, email, payment) use Oatmeal styling or the
   `@tailwindplus/elements` form controls if provided.
5. Update the progress indicators/step headers to use the design kit's
   typography and spacing.
6. Maintain existing validation/error messages and confirm they appear in the
   new font and colour scheme.
7. Test the entire checkout flow manually, submitting a real or sandbox order
   to verify nothing broke.
8. Add responsiveness checks on mobile to ensure the steps collapse/stack
   correctly.

## Acceptance Criteria

* Cart totals, item lists, and checkout steps visually match the Oatmeal style.
* All action buttons (e.g. "Continue to shipping") use `ButtonLink` or similar
  from the kit.
* Form controls render correctly and are usable (focus states, labels).
* Order submission still works; no regressions in payment processing.
* Responsive behaviour remains accessible on small screens.

---

This story ensures the revenue‑critical flows maintain both functionality and
the new visual polish.