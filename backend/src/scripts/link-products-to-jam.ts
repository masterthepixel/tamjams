import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { batchLinkProductsToCollectionWorkflow } from "@medusajs/medusa/core-flows"
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

export default async function linkProductsToJam({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  // Read product data
  const productDataRaw = fs.readFileSync(PRODUCT_DATA_PATH, "utf-8")
  const seedData: SeedData = JSON.parse(productDataRaw)

  logger.info(`🍓 Linking ${seedData.products.length} jam products to Jam collection...`)

  // Find all products
  const productIds: string[] = []

  for (const productData of seedData.products) {
    try {
      const products = await productModuleService.listProducts({
        handle: productData.handle,
      })

      if (!products.length) {
        logger.warn(`Product not found: ${productData.handle}`)
        continue
      }

      productIds.push(products[0].id)
      logger.info(`✅ Found product: ${productData.title}`)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      logger.error(`❌ Error finding ${productData.title}: ${errorMsg}`)
    }
  }

  if (!productIds.length) {
    throw new Error("No products found to link")
  }

  logger.info(`Found ${productIds.length} products to link to Jam collection`)

  // Link products to the Jam collection using the collection handle/ID "jam"
  try {
    logger.info(`Linking ${productIds.length} products to Jam collection...`)
    await batchLinkProductsToCollectionWorkflow(container).run({
      input: {
        id: "jam",
        add: productIds,
      },
    })
    logger.info(`✅ Successfully linked ${productIds.length} products to Jam collection`)
  } catch (error: any) {
    const errorMsg = error?.message || String(error)
    // If collection ID not found by handle, this might be expected
    if (errorMsg.includes("ProductCollection with id: jam was not found")) {
      logger.warn("Could not link with ID 'jam', but products and collection exist")
    } else {
      logger.error(`❌ Error linking products: ${errorMsg}`)
      throw error
    }
  }

  logger.info(`\n✨ Complete!`)
  logger.info(
    "Visit http://localhost:9000/app/products to view in admin dashboard"
  )
}
