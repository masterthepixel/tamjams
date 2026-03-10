import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function fixProductSalesChannelsV2({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const db = container.resolve(ContainerRegistrationKeys.DB)
  const productModuleService = container.resolve(Modules.PRODUCT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

  try {
    logger.info("🔧 Starting to fix product sales channel links (v2)...\n")

    // Get default sales channel
    const defaultSalesChannels = await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    })

    if (!defaultSalesChannels.length) {
      throw new Error("Default Sales Channel not found!")
    }

    const defaultSalesChannel = defaultSalesChannels[0]
    logger.info(`Using sales channel: ${defaultSalesChannel.name}`)
    logger.info(`Sales Channel ID: ${defaultSalesChannel.id}\n`)

    // Get all jam products
    const allProducts = await productModuleService.listProducts({})
    const jamProducts = allProducts.filter((p: any) =>
      ["strawberry", "raspberry", "blueberry", "apricot", "apple", "sour-cherry", "peach", "quince"].some(
        (flavor) => p.handle?.includes(flavor)
      )
    )

    logger.info(`Found ${jamProducts.length} jam products to update:\n`)

    // Use direct query to create the relationship
    // In Medusa V2, the relationship is stored in a join table
    let successCount = 0

    for (const product of jamProducts) {
      try {
        logger.info(`  Linking: ${product.title}...`)

        // Get the manager for executing raw queries
        const manager = db.manager

        // Try to insert the relationship directly into the product_sales_channel table
        // First, check if the relationship already exists
        const existingLink = await manager.query(
          `SELECT * FROM "product_sales_channel"
           WHERE "product_id" = $1 AND "sales_channel_id" = $2`,
          [product.id, defaultSalesChannel.id]
        )

        if (!existingLink || existingLink.length === 0) {
          // Insert the relationship
          await manager.query(
            `INSERT INTO "product_sales_channel" ("product_id", "sales_channel_id")
             VALUES ($1, $2)`,
            [product.id, defaultSalesChannel.id]
          )
          logger.info(`    ✅ Linked to sales channel`)
        } else {
          logger.info(`    ℹ️ Already linked to sales channel`)
        }

        successCount++
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        logger.error(`    ❌ Error: ${errorMsg}`)
      }
    }

    logger.info(`\n✨ Successfully processed ${successCount}/${jamProducts.length} products`)
    logger.info("\n🎉 Products should now be visible on the storefront!")
  } catch (error) {
    logger.error("❌ Error fixing sales channels:", error)
    throw error
  }
}
