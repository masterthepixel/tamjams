import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function fixSalesChannelsSQL({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    logger.info("🔧 Fixing product sales channels via direct query...\n")

    // Get the default sales channel ID
    const { data: salesChannels } = await query.graph({
      entity: "sales_channels",
      fields: ["id", "name", "handle"],
    })

    const defaultSalesChannel = salesChannels?.find((sc: any) => sc.name === "Default Sales Channel")

    if (!defaultSalesChannel) {
      throw new Error("Default Sales Channel not found!")
    }

    logger.info(`Default Sales Channel ID: ${defaultSalesChannel.id}\n`)

    // Get all jam products
    const { data: allProducts } = await query.graph({
      entity: "products",
      fields: ["id", "title", "handle"],
    })

    const jamProducts = allProducts?.filter((p: any) =>
      ["strawberry", "raspberry", "blueberry", "apricot", "apple", "sour-cherry", "peach", "quince"].some(
        (flavor) => p.handle?.includes(flavor)
      )
    ) || []

    logger.info(`Found ${jamProducts.length} jam products\n`)

    // Try to link using the upsert/add pattern via graph API
    let successCount = 0

    for (const product of jamProducts) {
      try {
        logger.info(`Linking ${product.title}...`)

        // Try updating the product with sales_channels relationship
        // Using the graph mutation pattern
        const { data: result } = await query.graph({
          entity: "products",
          fields: ["id", "title"],
          action: "update",
          data: {
            selector: { id: product.id },
            update: {
              // Try adding to existing sales channels
              sales_channels: [
                {
                  id: defaultSalesChannel.id,
                },
              ],
            },
          },
        })

        if (result) {
          logger.info(`✅ Updated`)
          successCount++
        }
      } catch (error) {
        logger.warn(
          `⚠️ Update failed: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }

    logger.info(`\n✨ Processed ${successCount}/${jamProducts.length} products`)

    if (successCount > 0) {
      logger.info("🎉 Products should now be visible on storefront!")
    } else {
      logger.warn("⚠️ Update may require manual intervention or database access")
    }
  } catch (error) {
    logger.error("Error:", error)
    throw error
  }
}
