import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  batchLinkProductsToCollectionWorkflow,
  batchLinkProductsToCategoryWorkflow,
} from "@medusajs/medusa/core-flows"
import * as fs from "fs"
import * as path from "path"

const PRODUCT_DATA_PATH = path.join(
  __dirname,
  "../../../DOCS/product-data.json"
)

interface ProductData {
  title: string
  handle: string
  flavor: string
  attributes: string[]
}

interface SeedData {
  products: ProductData[]
}

export default async function updateJamsProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  // Read product data
  const productDataRaw = fs.readFileSync(PRODUCT_DATA_PATH, "utf-8")
  const seedData: SeedData = JSON.parse(productDataRaw)

  logger.info(`🍓 Starting to update ${seedData.products.length} jam products...`)

  // Collect all product IDs
  const productIds: string[] = []

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
      productIds.push(product.id)

      logger.info(`✅ Found product: ${productData.title}`)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      logger.error(`❌ Error finding ${productData.title}: ${errorMsg}`)
    }
  }

  if (!productIds.length) {
    throw new Error("No products found to update")
  }

  logger.info(`Found ${productIds.length} products to update`)

  // Try to link to Products category
  try {
    const categories = await productModuleService.listProductCategories()
    const productsCategory = categories.find((c: any) => c.handle === "products")

    if (productsCategory) {
      logger.info("Linking products to Products category...")
      await batchLinkProductsToCategoryWorkflow(container).run({
        input: {
          id: productsCategory.id,
          add: productIds,
        },
      })
      logger.info(`✅ Linked ${productIds.length} products to Products category`)
    } else {
      logger.warn("Products category not found, skipping category linking")
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    logger.warn(`Could not link to category: ${errorMsg}`)
  }

  // Link all products to Jam collection
  try {
    logger.info("Linking products to Jam collection...")
    await batchLinkProductsToCollectionWorkflow(container).run({
      input: {
        id: "jam",
        add: productIds,
      },
    })
    logger.info(`✅ Linked ${productIds.length} products to Jam collection`)
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    logger.error(`❌ Error linking to collection: ${errorMsg}`)
    throw error
  }

  logger.info(`\n✨ Update complete!`)
  logger.info(
    "Visit http://localhost:9000/app/products to view in admin dashboard"
  )
}
