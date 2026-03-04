# Backend Scripts Guide

**Documentation for all Medusa backend scripts used in TamsJam product import workflow.**

---

## Scripts Overview

All scripts are located in `backend/src/scripts/` and executed via `pnpm medusa exec ./src/scripts/[script-name].ts`

### Working Scripts (✅ Verified & Tested)

| Script | Purpose | Status | Data Source |
|--------|---------|--------|-------------|
| `seed.ts` | Initialize database schema and regions | ✅ Original | Built-in defaults |
| `seed-products.ts` | Create 7 jam products with metadata | ✅ Custom | `DOCS/product-data.json` |
| `update-product-metadata.ts` | Update product metadata fields | ✅ Custom | `DOCS/product-data.json` |
| `create-jam-collection.ts` | Create "Jam" collection | ✅ Custom | Hardcoded |
| `update-products.ts` | Link products to categories/collections | ✅ Custom | Hardcoded IDs |
| `link-products-to-jam.ts` | Link all products to Jam collection | ✅ Custom | `DOCS/product-data.json` |

---

## Script Details

### 1. **seed.ts** — Database Initialization

**Purpose**: Initialize Medusa database with default regions, currencies, sales channels, and stock locations.

**What it does**:
- Creates store configuration
- Sets up regions (US, EU, etc.)
- Creates sales channels and API keys
- Sets up inventory and stock locations
- Creates tax regions and shipping options

**When to run**:
- First time setting up the project
- After resetting the database

**Command**:
```bash
pnpm medusa exec ./src/scripts/seed.ts
```

**Output**: ✅ Initializes all system tables and base configuration

---

### 2. **seed-products.ts** — Create Jam Products

**Purpose**: Create the 7 jam products with complete metadata from JSON data file.

**What it creates**:
- Product with title, description, handle, SKU
- Product options (Size)
- Product variant (12oz)
- Complete metadata:
  - Flavor
  - Ingredients (comma-separated)
  - Attributes (comma-separated)
  - Net weight
  - Nutrition facts (JSON string)
  - Storage instructions
  - Long description (brand story)

**Data source**: `backend/DOCS/product-data.json`

**Products created**:
1. Tams Jams - Strawberry
2. Tams Jams - Raspberry
3. Tams Jams - Apricot
4. Tams Jams - Apple
5. Tams Jams - Sour Cherry
6. Tams Jams - Peach
7. Tams Jams - Blueberry

**Command**:
```bash
pnpm seed:products
# Alias for: pnpm medusa exec ./src/scripts/seed-products.ts
```

**Example output**:
```
🍓 Creating 7 jam products...
✅ Created: Tams Jams - Strawberry
✅ Created: Tams Jams - Raspberry
✅ Created: Tams Jams - Apricot
✅ Created: Tams Jams - Apple
✅ Created: Tams Jams - Sour Cherry
✅ Created: Tams Jams - Peach
✅ Created: Tams Jams - Blueberry
✨ Product creation complete!
```

**Key implementation**:
```typescript
// Uses createProductsWorkflow from Medusa core-flows
await createProductsWorkflow(container).run({
  input: products.map(p => ({
    title: p.title,
    handle: p.handle,
    metadata: {
      flavor: p.flavor,
      ingredients: p.ingredients.join(", "),
      nutrition: JSON.stringify(p.nutrition),
      // ... other metadata fields
    },
    // ... product options and variants
  }))
})
```

---

### 3. **update-product-metadata.ts** — Update Metadata

**Purpose**: Update existing product metadata without re-creating products.

**Use cases**:
- Adding nutrition facts to already-created products
- Fixing metadata errors
- Adding new metadata fields to existing products

**Data source**: `backend/DOCS/product-data.json`

**Command**:
```bash
pnpm update:metadata
# Alias for: pnpm medusa exec ./src/scripts/update-product-metadata.ts
```

**Example output**:
```
🍓 Updating metadata for 7 products...
✅ Updated metadata for: Tams Jams - Strawberry
✅ Updated metadata for: Tams Jams - Raspberry
✅ Updated metadata for: Tams Jams - Apricot
✅ Updated metadata for: Tams Jams - Apple
✅ Updated metadata for: Tams Jams - Sour Cherry
✅ Updated metadata for: Tams Jams - Peach
✅ Updated metadata for: Tams Jams - Blueberry
✨ Metadata update complete!
```

**Key implementation**:
```typescript
// Find product by handle, then update metadata
const products = await productModuleService.listProducts({
  handle: productData.handle,
})

await productModuleService.updateProducts(
  product.id,
  {
    metadata: {
      flavor: productData.flavor,
      nutrition: JSON.stringify(productData.nutrition),
      // ... other metadata
    },
  }
)
```

**When to use**:
- After editing `DOCS/product-data.json`
- To fix metadata without recreating products
- Faster than `seed-products.ts` for updates only

---

### 4. **create-jam-collection.ts** — Create Collection

**Purpose**: Create the "Jam" collection for organizing products.

**What it creates**:
- Collection with title "Jam"
- Handle "jam"
- Description

**Command**:
```bash
pnpm create:jam-collection
# Alias for: pnpm medusa exec ./src/scripts/create-jam-collection.ts
```

**Output**:
```
✅ Jam collection created successfully!
Collection ID: jam
```

**Note**: If collection already exists, script handles error gracefully and continues.

**Key implementation**:
```typescript
await batchCreateCollectionsWorkflow(container).run({
  input: {
    collections: [{
      title: "Jam",
      handle: "jam",
    }]
  }
})
```

---

### 5. **update-products.ts** — Link to Categories/Collections

**Purpose**: Link all products to categories and collections.

**What it does**:
- Links all 7 products to "Products" category
- Links all 7 products to "Jam" collection (if collection exists)

**Command**:
```bash
pnpm update:products
# Alias for: pnpm medusa exec ./src/scripts/update-products.ts
```

**Output**:
```
✅ Linked all products to Products category
✅ Linked all products to Jam collection
```

**Key implementation**:
```typescript
// Link to category
await batchLinkProductsToCategoryWorkflow(container).run({
  input: {
    id: "products",  // category handle
    add: productIds,
  }
})

// Link to collection
await batchLinkProductsToCollectionWorkflow(container).run({
  input: {
    id: "jam",  // collection handle
    add: productIds,
  }
})
```

---

### 6. **link-products-to-jam.ts** — Link to Jam Collection

**Purpose**: Specifically link all products to the "Jam" collection (separate script).

**Command**:
```bash
pnpm link:products-to-jam
# Alias for: pnpm medusa exec ./src/scripts/link-products-to-jam.ts
```

**Output**:
```
🍓 Linking 7 jam products to Jam collection...
✅ Found product: Tams Jams - Strawberry
✅ Found product: Tams Jams - Raspberry
... (all 7 products)
✅ Successfully linked 7 products to Jam collection
✨ Complete!
```

**When to use**:
- Linking newly created products to collection
- Re-linking after collection changes
- More granular than `update-products.ts`

---

## Complete Workflow (Step by Step)

### First Time Setup
```bash
# 1. Initialize database schema
pnpm medusa exec ./src/scripts/seed.ts

# 2. Create jam products
pnpm seed:products

# 3. Create collection
pnpm create:jam-collection

# 4. Link products to categories and collections
pnpm update:products
```

### After Editing Product Data
```bash
# Just update metadata
pnpm update:metadata

# Or re-create everything if structure changes
pnpm seed:products  # This will fail if products exist
pnpm update:products
```

### To Add More Products
```bash
# 1. Add to DOCS/product-data.json
vim backend/DOCS/product-data.json

# 2. Create new products
pnpm seed:products

# 3. Link them
pnpm link:products-to-jam
```

---

## Data Sources

### `backend/DOCS/product-data.json`

Main data file for all 7 jam products. Used by:
- `seed-products.ts` — Creates products
- `update-product-metadata.ts` — Updates metadata
- `link-products-to-jam.ts` — Gets product handles for linking

**Structure**:
```json
{
  "products": [
    {
      "title": "Tams Jams - Strawberry",
      "handle": "tams-jams-strawberry",
      "description": "Premium homemade strawberry jam...",
      "longDescription": "Tam's Jams is a celebration of...",
      "flavor": "Strawberry",
      "sku": "TAMS-STRAWBERRY-12OZ",
      "netWeight": { "oz": 12, "g": 340 },
      "ingredients": ["Strawberries", "Cane Sugar", ...],
      "attributes": ["Real Fruit", "Non-GMO", ...],
      "nutrition": {
        "servings": 20,
        "servingSize": "1 tbsp (18g)",
        "calories": 35,
        ...
      },
      "storage": "Refrigerate after opening"
    },
    ...
  ]
}
```

---

## Troubleshooting Scripts

### Script Fails: "Product already exists"
**Cause**: `seed-products.ts` tries to create products that already exist
**Solution**: Use `update-product-metadata.ts` instead to update existing products

### Script Fails: "Collection not found"
**Cause**: `link-products-to-jam.ts` runs before collection is created
**Solution**: Run `create-jam-collection.ts` first

### Script Fails: "No products found to link"
**Cause**: Product handles don't match data file
**Solution**: Verify `DOCS/product-data.json` has correct handles matching created products

### Metadata not updating
**Cause**: JSON syntax error in `product-data.json`
**Solution**: Validate JSON: `jq . < backend/DOCS/product-data.json`

---

## Script Development Notes

### Pattern Used
All scripts follow the Medusa CLI script pattern:

```typescript
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function scriptName({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productService = container.resolve(Modules.PRODUCT)

  // Script logic here

  logger.info("✨ Complete!")
}
```

### Why `medusa exec` Instead of HTTP API?
- Direct container access to services
- No authentication required
- Full control over database
- Proper error handling and logging
- Transactions and rollback support

### Workflows vs Direct Service Calls
- **Mutations**: Use Medusa workflows (from `@medusajs/medusa/core-flows`)
- **Queries**: Use module services directly
- **Reason**: Workflows ensure data consistency and proper event handling

---

## Adding New Scripts

### When to Create a Script
- Batch operations on products
- One-time data migrations
- Complex linking operations
- Admin-level operations

### Template
```typescript
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function myScript({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  logger.info("Starting script...")

  // Your logic here

  logger.info("✨ Complete!")
}
```

### Register in package.json
```json
{
  "scripts": {
    "my:script": "medusa exec ./src/scripts/my-script.ts"
  }
}
```

---

## Performance Notes

- **seed-products.ts**: ~2-5 seconds for 7 products
- **update-product-metadata.ts**: ~1-2 seconds for 7 products
- **Link scripts**: ~1 second per operation
- **Total first-time setup**: ~10-15 seconds

---

## References

- **Medusa Scripts Docs**: https://docs.medusajs.com/learn/fundamentals/custom-cli-scripts
- **Product Workflows**: @medusajs/medusa/core-flows
- **Product Data File**: `backend/DOCS/product-data.json`

---

**Last Updated**: March 4, 2026
**Status**: All scripts verified working
