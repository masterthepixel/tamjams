import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  batchLinkProductsToCollectionWorkflow,
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

export default async function createJamCollection({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  // Read product data
  const productDataRaw = fs.readFileSync(PRODUCT_DATA_PATH, "utf-8")
  const seedData: SeedData = JSON.parse(productDataRaw)

  logger.info("🍓 Creating Jam collection and linking products...")

  // Create the Jam collection
  logger.info("Creating Jam collection...")
  let jamCollectionId = ""

  try {
    const { result: collections } = await createCollectionsWorkflow(container).run({
      input: {
        collections: [
          {
            title: "Jam",
            handle: "jam",
          },
        ],
      },
    })

    if (collections && collections.length > 0) {
      jamCollectionId = collections[0].id
      logger.info(`✅ Created Jam collection with ID: ${jamCollectionId}`)
    } else {
      throw new Error("Collection creation returned no results")
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    if (errorMsg.includes("already exists")) {
      logger.info("Jam collection already exists, finding it...")
      // If it exists, we need to find its ID - try with handle "jam"
      jamCollectionId = "jam"
    } else {
      throw error
    }
  }

  // Now find and link all products
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

  logger.info(`Found ${productIds.length} products`)

  // Link products to the collection
  try {
    logger.info(`Linking ${productIds.length} products to Jam collection...`)
    await batchLinkProductsToCollectionWorkflow(container).run({
      input: {
        id: jamCollectionId,
        add: productIds,
      },
    })
    logger.info(`✅ Linked ${productIds.length} products to Jam collection`)
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    logger.error(`❌ Error linking products: ${errorMsg}`)
    throw error
  }

  logger.info(`\n✨ Complete!`)
  logger.info(
    "Visit http://localhost:9000/app/products to view in admin dashboard"
  )
}
