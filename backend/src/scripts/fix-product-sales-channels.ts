import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function fixProductSalesChannels({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

  try {
    logger.info("🔧 Starting to fix product sales channel links...\n")

    // Get default sales channel
    const defaultSalesChannels = await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    })

    if (!defaultSalesChannels.length) {
      throw new Error("Default Sales Channel not found!")
    }

    const defaultSalesChannel = defaultSalesChannels[0]
    logger.info(`Using sales channel: ${defaultSalesChannel.name} (${defaultSalesChannel.id})\n`)

    // Get all jam products
    const allProducts = await productModuleService.listProducts({})
    const jamProducts = allProducts.filter((p: any) =>
      ["strawberry", "raspberry", "blueberry", "apricot", "apple", "sour-cherry", "peach", "quince"].some(
        (flavor) => p.handle?.includes(flavor)
      )
    )

    logger.info(`Found ${jamProducts.length} jam products to update:\n`)

    // Link each product to the default sales channel
    let successCount = 0
    for (const product of jamProducts) {
      try {
        logger.info(`  Linking: ${product.title}...`)

        // Add the sales channel to the product
        await productModuleService.updateProducts({
          id: product.id,
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        })

        logger.info(`    ✅ Linked to sales channel`)
        successCount++
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        logger.error(`    ❌ Error: ${errorMsg}`)
      }
    }

    logger.info(`\n✨ Fixed ${successCount}/${jamProducts.length} products`)
    logger.info("\n🎉 All jam products should now be visible on the storefront!")
  } catch (error) {
    logger.error("❌ Error fixing sales channels:", error)
    throw error
  }
}
