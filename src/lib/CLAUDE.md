# CLAUDE.md — src/lib/

Shared infrastructure: SDK configuration, utilities, hooks, and context. Code here is used everywhere else — changes here have wide impact.

## config.ts — SDK Setup

The Medusa SDK is initialized once here and exported as `sdk`. It wraps the native fetch to automatically inject the `x-medusa-locale` header on every request:

```typescript
const originalFetch = sdk.client.fetch.bind(sdk.client)
sdk.client.fetch = async (input, init) => {
  const localeHeader = await getLocaleHeader()
  return originalFetch(input, { ...init, headers: { ...localeHeader, ...init?.headers } })
}
```

Import `sdk` from `@lib/config` in all data files. Never instantiate a new SDK client elsewhere — because duplicate instances break cache sharing and publishableKey injection.

## data/

See [data/CLAUDE.md](data/CLAUDE.md) for patterns. Import data functions from `@lib/data/*` — never import them cross-module between feature modules.

## util/ — Pure Helpers

| File | Function | Use When |
|---|---|---|
| `money.ts` | `convertToLocale({ amount, currency_code, locale })` | Every price display — uses `Intl.NumberFormat` |
| `medusa-error.ts` | `medusaError(error)` | `.catch()` in all SDK mutations |
| `get-locale-header.ts` | `getLocaleHeader()` | Only called inside `config.ts` interceptor |
| `product.ts` | `isSimpleProduct(product)` | Check before showing option selectors in UI |
| `get-product-price.ts` | `getProductPrice({ product, variantId })` | Calculating cheapest/selected price for display |
| `get-percentage-diff.ts` | `getPercentageDiff(original, calculated)` | Discount % badge on prices |
| `compare-addresses.ts` | `compareAddresses(a, b)` | Checking billing = shipping in checkout |
| `sort-products.ts` | `sortProducts(products, sortBy)` | Client-side sort (used in store listing) |

All utils are pure functions — no side effects, no async (except `getLocaleHeader`).

## hooks/

Custom React hooks for client components. These complement data functions but run client-side.

## context/

React context providers. Wrap at the layout/page level, not inside loops or individual components — because context re-renders all consumers on every value change.

## Critical Rules

- NEVER import `sdk` directly in modules or components — all SDK calls go through `@lib/data/*` server actions
- NEVER display a raw price number — always pass through `convertToLocale()` — because currency formatting varies by locale and Medusa returns amounts in smallest denomination (cents)
- NEVER duplicate SDK instantiation — one instance in `config.ts`, period

## Common Mistakes

| Mistake | Fix |
|---|---|
| Formatting price with `toFixed(2)` | Use `convertToLocale()` — handles locale, currency symbol, decimals |
| Adding error handling to `medusaError` callers | `medusaError` already throws — just `.catch(medusaError)`, don't re-wrap |
| Calling `getLocaleHeader()` outside of `config.ts` | It's called automatically via the SDK interceptor |

Last updated: 2026-03-03
