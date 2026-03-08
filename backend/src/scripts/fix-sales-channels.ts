import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * fix-sales-channels.ts
 *
 * Fixes product visibility on the storefront by ensuring:
 * 1. A "Default Sales Channel" exists
 * 2. All products are linked to that sales channel
 * 3. The publishable API key is linked to that sales channel
 *
 * Run on Railway with:
 *   pnpm medusa exec ./src/scripts/fix-sales-channels.ts
 *
 * After running, copy the "✅ Publishable API Key Token" line
 * and update NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY on Vercel.
 */
export default async function fixSalesChannels({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const productModuleService = container.resolve(Modules.PRODUCT)

  logger.info("=== Fix Sales Channels Script ===")
  logger.info("")

  // ── Step 1: Get or create Default Sales Channel ──────────────────────────
  logger.info("Step 1: Checking Default Sales Channel...")

  let [defaultSalesChannel] = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  })

  if (!defaultSalesChannel) {
    logger.info("  No Default Sales Channel found. Creating one...")
    const [created] = await salesChannelModuleService.createSalesChannels([
      { name: "Default Sales Channel" },
    ])
    defaultSalesChannel = created
    logger.info(`  ✅ Created Default Sales Channel: ${defaultSalesChannel.id}`)
  } else {
    logger.info(`  ✅ Default Sales Channel exists: ${defaultSalesChannel.id}`)
  }

  // ── Step 2: Get all published products ───────────────────────────────────
  logger.info("")
  logger.info("Step 2: Fetching all products...")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "status", "sales_channels.id"],
  })

  logger.info(`  Found ${products.length} total products`)

  const productsToLink: string[] = []

  for (const product of products) {
    const alreadyLinked = product.sales_channels?.some(
      (sc: any) => sc.id === defaultSalesChannel.id
    )
    if (!alreadyLinked) {
      productsToLink.push(product.id)
      logger.info(`  → Will link: ${product.title} (${product.handle})`)
    } else {
      logger.info(`  ✓ Already linked: ${product.title}`)
    }
  }

  // ── Step 3: Link unlinked products to Default Sales Channel ──────────────
  logger.info("")
  if (productsToLink.length === 0) {
    logger.info("Step 3: All products already linked to Default Sales Channel ✅")
  } else {
    logger.info(`Step 3: Linking ${productsToLink.length} products to Default Sales Channel...`)

    // Batch link using the module service
    // The product module stores sales channel links via the link module
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    for (const productId of productsToLink) {
      await link.create({
        [Modules.PRODUCT]: { product_id: productId },
        [Modules.SALES_CHANNEL]: { sales_channel_id: defaultSalesChannel.id },
      })
    }

    logger.info(`  ✅ Successfully linked ${productsToLink.length} products`)
  }

  // ── Step 4: Get / create publishable API key ──────────────────────────────
  logger.info("")
  logger.info("Step 4: Checking publishable API key...")

  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "type", "title"],
    filters: { type: "publishable" },
  })

  let publishableKey = apiKeys?.[0]

  if (!publishableKey) {
    logger.warn("  No publishable API key found. Creating one...")
    // Import createApiKeysWorkflow lazily to avoid circular issues
    const { createApiKeysWorkflow } = await import(
      "@medusajs/medusa/core-flows"
    )
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Storefront",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    })
    publishableKey = result[0]
    logger.info(`  ✅ Created new publishable API key`)
  } else {
    logger.info(`  ✅ Found existing publishable API key: ${publishableKey.id}`)
  }

  // ── Step 5: Link sales channel to publishable API key ─────────────────────
  logger.info("")
  logger.info("Step 5: Linking Default Sales Channel to publishable API key...")

  try {
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableKey.id,
        add: [defaultSalesChannel.id],
      },
    })
    logger.info("  ✅ Sales channel linked to API key")
  } catch (error: any) {
    // If already linked, Medusa may throw a duplicate key error — safe to ignore
    if (error?.message?.includes("duplicate") || error?.message?.includes("already")) {
      logger.info("  ✅ Sales channel already linked to API key")
    } else {
      logger.warn(`  ⚠️  Link attempt result: ${error?.message}`)
    }
  }

  // ── Step 6: Verify ────────────────────────────────────────────────────────
  logger.info("")
  logger.info("Step 6: Verifying final state...")

  const { data: verifyProducts } = await query.graph({
    entity: "product",
    fields: ["id", "title", "sales_channels.id", "sales_channels.name"],
  })

  const linked = verifyProducts.filter((p: any) =>
    p.sales_channels?.some((sc: any) => sc.id === defaultSalesChannel.id)
  )

  logger.info(`  Products linked to Default Sales Channel: ${linked.length} / ${verifyProducts.length}`)

  // ── Summary ────────────────────────────────────────────────────────────────
  logger.info("")
  logger.info("=== SUMMARY ===")
  logger.info(`Sales Channel ID : ${defaultSalesChannel.id}`)
  logger.info(`Products visible : ${linked.length} / ${verifyProducts.length}`)
  logger.info(``)
  logger.info(`✅ Publishable API Key Token: ${publishableKey.token}`)
  logger.info(``)
  logger.info("ACTION REQUIRED:")
  logger.info("  Copy the token above and set it as NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY")
  logger.info("  on Vercel (Project Settings → Environment Variables).")
  logger.info("  Then redeploy the frontend.")
  logger.info("===============")
}
