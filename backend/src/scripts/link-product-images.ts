import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function linkProductImages({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const productModuleService = container.resolve(Modules.PRODUCT)

  // Image mapping: product handles to their image URLs
  const imageMapping: Record<string, string[]> = {
    "tams-jams-strawberry": [
      "/static/1772912503224-thumbnail-Homemade-Strawberry-Jam-scaled.jpg",
      "/static/1772912579303-strawberry-preserves-010.jpg",
      "/static/1772912579303-StrawberryJelly.webp",
    ],
  }

  logger.info("🖼️  Starting to link product images...")

  try {
    for (const [handle, imageUrls] of Object.entries(imageMapping)) {
      logger.info(`Processing product: ${handle}`)

      // Fetch product
      const products = await productModuleService.listProducts({
        handle,
      })

      if (!products || products.length === 0) {
        logger.warn(`Product not found: ${handle}`)
        continue
      }

      const product = products[0]
      logger.info(`Found product: ${product.title} (ID: ${product.id})`)

      // Add images to product
      const imagesToAdd = imageUrls.map((url) => ({
        url,
      }))

      // Update product with images
      await productModuleService.updateProducts({
        id: product.id,
        images: imagesToAdd,
      })

      logger.info(`✅ Added ${imageUrls.length} images to ${product.title}`)
    }

    logger.info("✅ Successfully linked all product images")
  } catch (error) {
    logger.error(
      "❌ Error linking product images:",
      error instanceof Error ? error.message : error
    )
    throw error
  }
}
