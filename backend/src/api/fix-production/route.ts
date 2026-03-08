import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * One-time production fix endpoint.
 *
 * POST /admin/fix-production
 * Header: x-fix-secret: <ADMIN_FIX_SECRET env var>
 *
 * Links all products to Default Sales Channel and returns the publishable API key.
 * DELETE THIS ROUTE AFTER USE.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const secret = req.headers["x-fix-secret"]
  const expectedSecret = process.env.ADMIN_FIX_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  const container = req.scope
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  const report: string[] = []

  try {
    // ── Step 1: Get or create Default Sales Channel ──────────────────────
    let [defaultSalesChannel] =
      await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
      })

    if (!defaultSalesChannel) {
      const [created] = await salesChannelModuleService.createSalesChannels([
        { name: "Default Sales Channel" },
      ])
      defaultSalesChannel = created
      report.push(`Created Default Sales Channel: ${defaultSalesChannel.id}`)
    } else {
      report.push(`Found Default Sales Channel: ${defaultSalesChannel.id}`)
    }

    // ── Step 2: Get all products ──────────────────────────────────────────
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle", "sales_channels.id"],
    })

    report.push(`Found ${products.length} products`)

    // ── Step 3: Link unlisted products ────────────────────────────────────
    let linked = 0
    const skipped = 0

    for (const product of products) {
      const alreadyLinked = product.sales_channels?.some(
        (sc: any) => sc.id === defaultSalesChannel.id
      )
      if (!alreadyLinked) {
        await link.create({
          [Modules.PRODUCT]: { product_id: product.id },
          [Modules.SALES_CHANNEL]: {
            sales_channel_id: defaultSalesChannel.id,
          },
        })
        linked++
        report.push(`  Linked: ${product.title}`)
      } else {
        report.push(`  Already linked: ${product.title}`)
      }
    }

    report.push(`Linked ${linked} new products (${skipped} already linked)`)

    // ── Step 4: Get / create publishable API key ──────────────────────────
    const { data: apiKeys } = await query.graph({
      entity: "api_key",
      fields: ["id", "token", "type", "title"],
      filters: { type: "publishable" },
    })

    let publishableKey = apiKeys?.[0]

    if (!publishableKey) {
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
      report.push(`Created new publishable API key`)
    } else {
      report.push(`Found existing publishable API key: ${publishableKey.id}`)
    }

    // ── Step 5: Link sales channel to API key ─────────────────────────────
    try {
      await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: {
          id: publishableKey.id,
          add: [defaultSalesChannel.id],
        },
      })
      report.push(`Linked sales channel to API key`)
    } catch (err: any) {
      report.push(`Sales channel link: ${err?.message ?? "already linked"}`)
    }

    res.status(200).json({
      success: true,
      publishable_api_key: publishableKey.token,
      sales_channel_id: defaultSalesChannel.id,
      products_total: products.length,
      products_newly_linked: linked,
      report,
      next_step:
        "Copy publishable_api_key and set it as NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY on Vercel, then redeploy.",
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message ?? "Unknown error",
      report,
    })
  }
}
