import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createProductsWorkflow,
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
  videoUrls?: string[]
}

interface SeedData {
  products: ProductData[]
}

export default async function seedJamsProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const productModuleService = container.resolve(Modules.PRODUCT)

  // Read product data
  const productDataRaw = fs.readFileSync(PRODUCT_DATA_PATH, "utf-8")
  const seedData: SeedData = JSON.parse(productDataRaw)

  logger.info(`🍓 Starting to seed ${seedData.products.length} jam products...`)

  // Get default sales channel
  const defaultSalesChannels = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  })
  const defaultSalesChannel = defaultSalesChannels[0]

  if (!defaultSalesChannel) {
    throw new Error("Default Sales Channel not found. Please run the main seed first.")
  }

  logger.info(`Using sales channel: ${defaultSalesChannel.name}`)

  // Get or create Products category
  // fetch existing categories and lookup the Products category by name/handle
  // first attempt: direct graph query by handle (bypasses pagination issues)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  let productsCategory: any = null
  try {
    const { data: foundCats } = await query.graph({
      entity: "product_category",
      fields: ["id", "name", "handle"],
      filters: { handle: "products" },
    })
    if (foundCats && foundCats.length > 0) {
      productsCategory = foundCats[0]
    }
  } catch (err) {
    // ignore, fall back to service list
  }

  // fallback: list via module service
  if (!productsCategory) {
    const categories = await productModuleService.listProductCategories()
    productsCategory = categories.find((c: any) => c.name === "Products" || c.handle === "products")
  }

  if (!productsCategory) {
    logger.info("Creating Products category...")
    try {
      const newCategories = await productModuleService.createProductCategories({
        name: "Products",
        is_active: true,
      })
      productsCategory = Array.isArray(newCategories)
        ? newCategories[0]
        : newCategories
    } catch (error) {
      // If already exists, fetch again
      logger.info("Category already exists, fetching by handle...")
      const { data: foundCats } = await query.graph({
        entity: "product_category",
        fields: ["id", "name", "handle"],
        filters: { handle: "products" },
      })
      productsCategory = foundCats?.[0]
      if (!productsCategory) {
        throw error
      }
    }
  }

  if (!productsCategory) {
    throw new Error("Failed to get or create Products category")
  }

  logger.info(`Using category: ${productsCategory.name}`)

  logger.info(`Using category: ${productsCategory.name}`)

  // Note: Jam collection linking will be done via workflow after product creation

  // Transform data into workflow format
  const productsToCreate = seedData.products.map((product) => ({
    title: product.title,
    handle: product.handle,
    description: product.description,
    status: ProductStatus.PUBLISHED,
    category_ids: [productsCategory.id],
    // no tags are provided - tags can be added later via admin or separate workflow
    tags: [],
    metadata: {
      flavor: product.flavor,
      ingredients: product.ingredients.join(", "),
      attributes: product.attributes.join(", "),
      netWeight: `${product.netWeight.oz}oz / ${product.netWeight.g}g`,
      nutrition: product.nutrition ? JSON.stringify(product.nutrition) : undefined,
      storage: product.storage,
      longDescription: product.longDescription,
      videoUrls: product.videoUrls ? JSON.stringify(product.videoUrls) : undefined,
    },
    options: [
      {
        title: "Size",
        values: ["12oz"],
      },
    ],
    variants: [
      {
        title: `${product.flavor} - 12oz`,
        sku: product.sku,
        options: {
          Size: "12oz",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 999, // $9.99
          },
        ],
      },
    ],
    sales_channels: [
      {
        id: defaultSalesChannel.id,
      },
    ],
  }))

  try {
    const { result: createdProducts } = await createProductsWorkflow(
      container
    ).run({
      input: {
        products: productsToCreate,
      },
    })

    logger.info(
      `✅ Successfully created ${createdProducts.length} jam products`
    )

    // Link products to Jam collection
    logger.info(`Linking products to Jam collection...`)
    await batchLinkProductsToCollectionWorkflow(container).run({
      input: {
        id: "jam",
        add: createdProducts.map((p: any) => p.id),
      },
    })

    logger.info(`✅ Successfully linked products to collection`)
    logger.info(
      "Visit http://localhost:9000/app/products to view in admin dashboard"
    )
  } catch (error) {
    logger.error(
      `❌ Error creating products:`,
      error instanceof Error ? error.message : error
    )
    throw error
  }
}
