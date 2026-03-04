# CLAUDE.md — src/app/

Next.js 15 App Router pages. All routes are nested under `[countryCode]/` for multi-region support. The middleware at [`src/middleware.ts`](../middleware.ts) guarantees a valid countryCode is always present in the URL before any page renders.

## Route Structure

```
app/
├── layout.tsx                           # Root: sets metadata baseUrl, html/body
└── [countryCode]/
    ├── (main)/                          # Storefront layout (nav + footer)
    │   ├── layout.tsx                   # Fetches customer + cart for all main routes
    │   ├── page.tsx                     # Home
    │   ├── cart/page.tsx
    │   ├── products/[handle]/page.tsx
    │   ├── store/page.tsx
    │   ├── collections/[handle]/page.tsx
    │   ├── categories/[...category]/page.tsx
    │   ├── account/@dashboard/          # Parallel route slot
    │   └── order/[id]/confirmed/page.tsx
    └── (checkout)/                      # Checkout layout (stripped, no nav/footer)
        └── checkout/page.tsx
```

## Accessing Route Params (Next.js 15)

`params` and `searchParams` are now Promises in Next.js 15 — always `await` them:

```tsx
// Page component
export default async function Page(props: {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { countryCode, handle } = await props.params
  const { page } = await props.searchParams
  // ...
}
```

Missing `await` on `props.params` causes a runtime error that looks like a type error — it's not.

## Layout-Level Data Fetching

The `(main)/layout.tsx` fetches `customer` and `cart` once and passes them to Nav components. Don't re-fetch these in individual pages — because the layout already has them and re-fetching creates redundant network requests.

## Handling Missing Resources

```tsx
import { notFound } from "next/navigation"

const product = await getProduct(handle)
if (!product) notFound() // renders the nearest not-found.tsx
```

Use `notFound()` for invalid handles/slugs. Use `redirect()` for auth-gated pages (e.g., redirect to login if no customer session).

## Metadata

Add metadata to every page for SEO. Use the async `generateMetadata` pattern when metadata depends on fetched data:

```tsx
export async function generateMetadata(props: { params: Promise<{ handle: string }> }) {
  const { handle } = await props.params
  const product = await getProduct(handle)
  return { title: product?.title, description: product?.description }
}
```

## Account Parallel Routes

The account section uses Next.js parallel routes (`@dashboard` slot) to show different content based on whether the user is logged in, without a full page navigation. Adding new account sub-pages means adding them inside the `@dashboard/` directory.

## Critical Rules

- NEVER hardcode country codes — always read from `params.countryCode` — because the middleware controls which code is valid per user
- NEVER fetch customer or cart in a `(main)` page — the layout already fetches them; pass them down or re-read from the layout's data
- NEVER skip `await props.params` — Next.js 15 made params async; synchronous access returns a Promise object, not the value

## Common Mistakes

| Mistake | Fix |
|---|---|
| `const { handle } = props.params` (no await) | `const { handle } = await props.params` |
| Page fetches customer when already in (main) layout | Remove; layout fetches once for all children |
| Missing `notFound()` for invalid route params | Always guard data fetches with `if (!data) notFound()` |
| Adding checkout content to (main) layout | Checkout uses the `(checkout)` route group — no nav/footer there |
| Building URLs with string concatenation | Use helper functions or `localized-client-link` from `@modules/common` |

Last updated: 2026-03-03
