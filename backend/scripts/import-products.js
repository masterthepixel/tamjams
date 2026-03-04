#!/usr/bin/env node

/**
 * Jam Products Import Script
 * Imports Tam's Jams product data into Medusa backend
 *
 * Usage: node scripts/import-products.js
 */

const fs = require("fs")
const path = require("path")
const axios = require("axios")

const MEDUSA_API_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const PRODUCT_DATA_PATH = path.join(__dirname, "../../DOCS/product-data.json")

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
}

const log = {
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ️${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
}

// Create axios instance with cookie jar support
const api = axios.create({
  baseURL: MEDUSA_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Store cookies from responses
let cookies = ""
api.interceptors.response.use((response) => {
  const setCookie = response.headers["set-cookie"]
  if (setCookie) {
    if (Array.isArray(setCookie)) {
      cookies = setCookie.map((c) => c.split(";")[0]).join("; ")
    } else {
      cookies = setCookie.split(";")[0]
    }
    api.defaults.headers.common["Cookie"] = cookies
  }
  return response
})

async function getOrCreateCollection() {
  try {
    // Try to fetch existing collection
    const response = await api.get("/admin/collections?title=Tam's Jams")
    if (response.data.collections && response.data.collections.length > 0) {
      log.info(`Using existing collection: Tam's Jams`)
      return response.data.collections[0].id
    }
  } catch (error) {
    log.warn("Could not fetch existing collections")
  }

  // Create new collection
  try {
    const response = await api.post("/admin/collections", {
      title: "Tam's Jams",
      handle: "tams-jams",
      description: "Premium homemade jams by Tam - Real fruit, non-GMO, no additives",
    })

    if (response.data.collection) {
      log.success(`Created collection: Tam's Jams`)
      return response.data.collection.id
    }
  } catch (error) {
    log.warn(
      "Could not create collection (may not have permissions in test mode)"
    )
    return null
  }
}

async function createProduct(productData, collectionId) {
  try {
    // Create product
    const productResponse = await api.post("/admin/products", {
      title: productData.title,
      handle: productData.handle,
      description: productData.description,
      collection_id: collectionId,
      tags: productData.attributes,
      metadata: {
        flavor: productData.flavor,
        ingredients: productData.ingredients,
        netWeight: `${productData.netWeight.oz}oz / ${productData.netWeight.g}g`,
      },
    })

    if (!productResponse.data.product) {
      throw new Error("No product returned from API")
    }

    const product = productResponse.data.product
    log.success(`Created product: ${product.title} (ID: ${product.id})`)

    // Create variant with pricing
    if (product.id) {
      try {
        const variantResponse = await api.post(
          `/admin/products/${product.id}/variants`,
          {
            title: productData.flavor,
            sku: productData.sku,
            prices: [
              {
                currency_code: "usd",
                amount: 999, // $9.99
              },
            ],
          }
        )

        if (variantResponse.data.variant) {
          log.info(
            `  └─ Variant: ${productData.flavor} - ${productData.sku} - $9.99`
          )
        }
      } catch (variantError) {
        log.warn(`  └─ Could not create variant (may need manual setup)`)
      }
    }

    return product.id
  } catch (error) {
    if (error.response?.status === 409) {
      log.warn(`Product already exists: ${productData.title}`)
      return null
    }

    log.error(`Failed to create ${productData.title}`)
    console.error(
      `  Error: ${error.response?.data?.message || error.message}`
    )
    return null
  }
}

async function loginAdmin() {
  try {
    const response = await api.post("/admin/auth/user", {
      email: "admin@example.com",
      password: "adminpass123",
    })
    log.success("Authenticated as admin")
    return true
  } catch (error) {
    log.warn("Could not authenticate - trying without login")
    return false
  }
}

async function main() {
  console.log("\n" + "=".repeat(60))
  console.log("🍓 Tam's Jams - Product Import Script")
  console.log("=".repeat(60) + "\n")

  // Check connection
  try {
    const healthCheck = await api.get("/health")
    log.success(`Connected to Medusa API (${MEDUSA_API_URL})`)
  } catch (error) {
    log.error(
      `Cannot connect to Medusa API at ${MEDUSA_API_URL}`
    )
    log.info("Make sure the backend is running: cd backend && pnpm dev")
    process.exit(1)
  }

  // Try to login
  await loginAdmin()

  // Load product data
  let productData
  try {
    const dataRaw = fs.readFileSync(PRODUCT_DATA_PATH, "utf-8")
    productData = JSON.parse(dataRaw)
    log.success(`Loaded ${productData.products.length} products from ${PRODUCT_DATA_PATH}`)
  } catch (error) {
    log.error(`Failed to load product data from ${PRODUCT_DATA_PATH}`)
    console.error(error)
    process.exit(1)
  }

  // Get or create collection
  const collectionId = await getOrCreateCollection()

  // Create products
  console.log(`\n${"─".repeat(60)}`)
  console.log("Creating products...\n")

  let successCount = 0
  for (const product of productData.products) {
    const productId = await createProduct(product, collectionId)
    if (productId) {
      successCount++
    }
  }

  // Summary
  console.log(`\n${"─".repeat(60)}`)
  console.log(`Results: ${successCount}/${productData.products.length} products created`)
  console.log(`\n📊 View products in admin:`)
  console.log(`   → http://localhost:9000/app/products`)
  console.log(`\n🌐 View on storefront:`)
  console.log(`   → http://localhost:8000`)
  console.log("\n" + "=".repeat(60) + "\n")
}

// Run the script
main().catch((error) => {
  log.error("Fatal error:")
  console.error(error)
  process.exit(1)
})
