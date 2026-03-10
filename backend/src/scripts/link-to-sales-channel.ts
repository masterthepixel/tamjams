import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function linkProductsToSalesChannel({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

  try {
    logger.info("🔗 Linking jam products to sales channel via workflow...\n")

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

    // Get jam products
    const allProducts = await productModuleService.listProducts({})
    const jamProducts = allProducts.filter((p: any) =>
      ["strawberry", "raspberry", "blueberry", "apricot", "apple", "sour-cherry", "peach", "quince"].some(
        (flavor) => p.handle?.includes(flavor)
      )
    )

    logger.info(`Found ${jamProducts.length} jam products to update\n`)

    // Use the updateProductsWorkflow to link them
    const productUpdates = jamProducts.map((product: any) => ({
      id: product.id,
      sales_channels: [
        {
          id: defaultSalesChannel.id,
        },
      ],
    }))

    logger.info("Running update workflow...")

    const { result } = await updateProductsWorkflow(container).run({
      input: {
        products: productUpdates,
      },
    })

    logger.info(`✅ Successfully linked ${result.length} products to sales channel`)
    logger.info("\n🎉 Products should now be visible on storefront!")
  } catch (error) {
    logger.error("❌ Error:", error instanceof Error ? error.message : error)
    throw error
  }
}
