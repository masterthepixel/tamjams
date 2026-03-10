import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function diagnoseProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productModuleService = container.resolve(Modules.PRODUCT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

  try {
    logger.info("=== PRODUCT DIAGNOSIS ===\n")

    // 1. List all sales channels
    logger.info("1️⃣ Sales Channels:")
    const allSalesChannels = await salesChannelModuleService.listSalesChannels({})
    allSalesChannels.forEach((sc: any, i: number) => {
      logger.info(`  ${i + 1}. ${sc.name} (ID: ${sc.id})`)
    })

    if (!allSalesChannels.length) {
      logger.error("❌ No sales channels found!")
      return
    }

    // 2. Count total products
    logger.info("\n2️⃣ Products in Database:")
    const allProducts = await productModuleService.listProducts({})
    logger.info(`  Total products: ${allProducts.length}`)

    // 3. Check jam products specifically
    const jamProducts = allProducts.filter((p: any) =>
      ["strawberry", "raspberry", "blueberry", "apricot", "apple", "sour-cherry", "peach", "quince"].some(
        (flavor) => p.handle?.includes(flavor)
      )
    )
    logger.info(`  Jam products found: ${jamProducts.length}`)

    // 4. Inspect each jam product's sales channel links
    logger.info("\n3️⃣ Jam Product Sales Channel Links:")
    for (const product of jamProducts) {
      logger.info(`\n  Product: ${product.title} (${product.handle})`)
      logger.info(`    ID: ${product.id}`)

      // Try to get product with sales_channels via query.graph
      try {
        const { data: productWithSalesChannels } = await query.graph({
          entity: "products",
          filters: { id: product.id },
          fields: ["id", "title", "handle", "sales_channels"],
        })

        if (productWithSalesChannels?.length > 0) {
          const prod = productWithSalesChannels[0]
          const salesChannels = prod.sales_channels || []
          if (salesChannels.length > 0) {
            logger.info(`    ✅ Sales Channels (${salesChannels.length}):`)
            salesChannels.forEach((sc: any) => {
              logger.info(`       - ${sc.name || sc.id}`)
            })
          } else {
            logger.warn(`    ⚠️ No sales channels linked!`)
          }
        } else {
          logger.warn(`    ⚠️ Could not load sales channel info`)
        }
      } catch (error) {
        logger.warn(`    ⚠️ Error querying sales channels`)
      }
    }

    // 5. Test API endpoint response
    logger.info("\n4️⃣ Testing Store API Response:")
    try {
      // Simulate what the frontend API call does
      const { data: storeProducts } = await query.graph({
        entity: "products",
        filters: {
          sales_channels: {
            handle: ["default"], // This is how store API filters
          },
        },
        fields: ["id", "title", "handle"],
      })

      logger.info(`  Products accessible via store API: ${storeProducts?.length || 0}`)
      if (storeProducts?.length > 0) {
        logger.info("  Sample products:")
        storeProducts.slice(0, 3).forEach((p: any) => {
          logger.info(`    - ${p.title}`)
        })
      }
    } catch (error) {
      logger.warn(
        `  ⚠️ Could not query via store API filters: ${error instanceof Error ? error.message : String(error)}`
      )
    }

    // 6. Check default sales channel ID
    logger.info("\n5️⃣ Default Sales Channel Details:")
    const defaultSalesChannels = await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    })
    if (defaultSalesChannels.length > 0) {
      const defaultSC = defaultSalesChannels[0]
      logger.info(`  Name: ${defaultSC.name}`)
      logger.info(`  ID: ${defaultSC.id}`)
      logger.info(`  Handle: ${defaultSC.handle}`)
    } else {
      logger.warn(`  ❌ Default Sales Channel not found!`)
    }

    logger.info("\n=== END DIAGNOSIS ===")
  } catch (error) {
    logger.error("Diagnosis failed:", error)
  }
}
