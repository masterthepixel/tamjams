# CLAUDE.md — src/modules/

Feature modules. Each module is self-contained: its own components, templates, and actions. No cross-module imports between feature modules.

## Template vs Component

**Templates** (`templates/`) are entry points — they fetch data and compose components:
- Usually server components (async functions, no `"use client"`)
- Own the data fetching for their feature area
- Wrap async children in `<Suspense>` with skeleton fallbacks
- Correspond 1:1 with a page or major page section

**Components** (`components/`) are the building blocks:
- Server components by default
- Add `"use client"` only when the component needs hooks, event handlers, or browser APIs
- Keep `"use client"` boundary as low as possible in the tree

Golden example: [`products/templates/index.tsx`](products/templates/index.tsx) — server template wrapping a client component in Suspense. [`products/components/product-actions/index.tsx`](products/components/product-actions/index.tsx) — correct `"use client"` component with `useState`, `useMemo`, URL sync.

## Suspense Pattern

Every async server component rendered inside a template needs a Suspense boundary with a skeleton fallback — because without it, the entire page blocks on that one async operation:

```tsx
// In template:
<Suspense fallback={<ProductActionsSkeletons />}>
  <ProductActionsWrapper product={product} region={region} />
</Suspense>
```

Skeletons live in [`skeletons/`](skeletons/).

## Form Handling

Server actions + `useActionState` for all form submissions:

```tsx
// Client component
const [state, action, pending] = useActionState(myServerAction, { success: false, error: null })

return <form action={action}>
  <input name="field" />
  <SubmitButton isLoading={pending} />
  {state.error && <p>{state.error}</p>}
</form>
```

Server action lives in `@lib/data/` — returns `{ success: boolean, error: string | null }`. Golden example: [`checkout/components/addresses/index.tsx`](checkout/components/addresses/index.tsx).

## Checkout Step Navigation

The checkout flow is step-based, controlled by the `step` query param (`?step=address`, `?step=delivery`, `?step=payment`, `?step=review`). Navigate between steps with `router.push(pathname + "?step=next")` — not by passing state down.

## Shared UI (`common/`)

Before building a new component, check `common/components/` — it has:
- `localized-client-link` — internal links that prepend countryCode (use this, not Next.js `Link`, for storefront navigation)
- `line-item-price`, `line-item-unit-price`, `line-item-options` — for cart/order line items
- `cart-totals` — full totals breakdown
- `delete-button` — delete with loading state
- `radio`, `checkbox`, `input` — form primitives

## `layout/` Module

Nav and footer. Country and language selectors are server-rendered but trigger client-side mutations:
- `updateRegion()` — switches cart region, revalidates cart cache
- `updateLocale()` — switches locale, revalidates product/category cache

## Critical Rules

- NEVER import between feature modules (e.g., `cart/` importing from `checkout/`) — because it creates implicit coupling; use `common/` for shared UI or `@lib/` for shared logic
- NEVER use hardcoded URLs — because country code is dynamic; use `localized-client-link` or build paths with `useParams()`
- NEVER place `"use client"` higher than necessary — because it disables server rendering for the entire subtree

## Common Mistakes

| Mistake | Fix |
|---|---|
| Fetching data inside a client component | Lift data fetch to the parent server template, pass as props |
| Using Next.js `<Link>` for storefront links | Use `localized-client-link` — it prepends `/{countryCode}` |
| Skipping Suspense on async server components | Wrap in `<Suspense fallback={<Skeleton />}>` |
| Putting form logic in templates | Form logic belongs in a dedicated client component inside `components/` |
| Calling data functions from client components | Data functions are `"use server"` only — use server actions via `useActionState` |

Last updated: 2026-03-03
