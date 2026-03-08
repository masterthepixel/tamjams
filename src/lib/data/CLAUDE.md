# CLAUDE.md — src/lib/data/

Server-only data layer. All Medusa SDK calls, server actions, and cache management live here. Every file has `"use server"` at the top.

## SDK Call Pattern

Every call must spread both headers and cache options — omitting either causes auth or stale-data bugs:

```typescript
// Fetch (read)
const headers = { ...(await getAuthHeaders()) }
const next = { ...(await getCacheOptions("carts")) }
return sdk.store.cart.retrieve(cartId, {}, { headers, next })

// Mutate (write)
return sdk.store.cart.update(cartId, body, {}, { headers })
  .then(async ({ cart }) => {
    revalidateTag(await getCacheTag("carts"))
    return cart
  })
  .catch(medusaError)
```

Golden example: [products.ts `listProducts()`](products.ts) — pagination + caching + region handling.

## Cache Tags

`getCacheOptions(key)` returns a `next` object scoped to the current region's `_medusa_cache_id` cookie. Tags are always region-specific.

After any mutation, revalidate **all** tags affected — cart updates affect both `"carts"` and `"fulfillment"`:

```typescript
const cacheTag = await getCacheTag("carts")
revalidateTag(cacheTag)
// Also revalidate related tags if needed:
revalidateTag(await getCacheTag("fulfillment"))
```

## Cookies Utilities (`cookies.ts`)

| Function | Purpose |
|---|---|
| `getAuthHeaders()` | Returns `{ Authorization: "Bearer <jwt>" }` or `{}` |
| `getCacheOptions(key)` | Returns `{ tags: ["<key>_<cacheId>"] }` for Next.js fetch |
| `getCacheTag(key)` | Returns the tag string for `revalidateTag()` |
| `getCartId()` / `setCartId()` | Cart persistence in cookie |
| `setAuthToken()` / `removeAuthToken()` | JWT cookie management |

All cookie functions are async — always `await` them.

## Server Action Return Shape

Server actions used with `useActionState` must return a consistent shape:

```typescript
export async function myAction(state: unknown, formData: FormData) {
  try {
    const value = formData.get("field") as string
    await sdk.store.something.do(value, {}, { headers: await getAuthHeaders() })
    revalidateTag(await getCacheTag("relevant-key"))
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: "Something went wrong" }
  }
}
```

Actions with redirects (e.g., post-signup) call `redirect()` inside the `try` block — catch only handles errors.

Golden example: [cart.ts `setAddresses()`](cart.ts) — FormData parsing + validation + redirect.

## Auth Flow Requirements

After `login()` or `signup()`, always call `transferCart()` — this associates the anonymous cart with the new customer session. Skipping this loses cart items.

## `sdk.client.fetch` vs SDK Methods

Use typed SDK methods (`sdk.store.cart.retrieve()`) when available. Fall back to `sdk.client.fetch(endpoint, { method, query, headers, next, cache })` only for endpoints without a typed method.

## Critical Rules

- NEVER call SDK without spreading `await getAuthHeaders()` into headers — requests silently succeed but return wrong data for authenticated users
- NEVER mutate without calling `revalidateTag()` — Next.js serves stale data from cache indefinitely
- NEVER use `.catch(() => null)` — use `.catch(medusaError)` so errors surface properly
- NEVER import from here in client components — all files are server-only (`"use server"`)

## Common Mistakes

| Mistake | Fix |
|---|---|
| Missing `await` on `getCacheOptions()` or `getAuthHeaders()` | Always await — they read cookies asynchronously |
| Revalidating only one tag after cart mutation | Cart changes also need `fulfillment` tag revalidated |
| Passing `undefined` for `regionId` | Always validate regionId exists before calling product/price APIs |
| Forgetting `transferCart()` after auth | Call it in both `login()` and `signup()` flows |
| Using `sdk.client.fetch` for endpoints with typed methods | Check SDK source for typed alternatives first |

Last updated: 2026-03-03
