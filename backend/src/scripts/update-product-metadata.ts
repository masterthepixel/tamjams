import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import * as fs from "fs"
import * as path from "path"

const PRODUCT_DATA_PATH = path.join(
  __dirname,
  "../../../DOCS/product-data.json"
)

interface ProductData {
  title: string
  handle: string
  description: string
  longDescription?: string
  flavor: string
  sku: string
  netWeight: {
    oz: number
    g: number
  }
  ingredients: string[]
  attributes: string[]
  nutrition?: {
    servings: number
    servingSize: string
    calories: number
    totalFat: string
    saturatedFat: string
    transFat: string
    cholesterol: string
    sodium: string
    totalCarbs: string
    fiber: string
    totalSugars: string
    addedSugars: string
    protein: string
  }
  storage?: string
}

interface SeedData {
  products: ProductData[]
}

export default async function updateProductMetadata({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  // Read product data
  const productDataRaw = fs.readFileSync(PRODUCT_DATA_PATH, "utf-8")
  const seedData: SeedData = JSON.parse(productDataRaw)

  logger.info(`🍓 Updating metadata for ${seedData.products.length} products...`)

  for (const productData of seedData.products) {
    try {
      // Find product by handle
      const products = await productModuleService.listProducts({
        handle: productData.handle,
      })

      if (!products.length) {
        logger.warn(`Product not found: ${productData.handle}`)
        continue
      }

      const product = products[0]

      // Update product metadata
      await productModuleService.updateProducts(
        product.id,
        {
          metadata: {
            flavor: productData.flavor,
            ingredients: productData.ingredients.join(", "),
            attributes: productData.attributes.join(", "),
            netWeight: `${productData.netWeight.oz}oz / ${productData.netWeight.g}g`,
            nutrition: productData.nutrition ? JSON.stringify(productData.nutrition) : undefined,
            storage: productData.storage,
            longDescription: productData.longDescription,
          },
        }
      )

      logger.info(`✅ Updated metadata for: ${productData.title}`)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      logger.error(`❌ Error updating ${productData.title}: ${errorMsg}`)
    }
  }

  logger.info(`\n✨ Metadata update complete!`)
  logger.info(
    "Visit http://localhost:8000 to view products on the storefront"
  )
}
