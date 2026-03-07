/**
 * One-shot script: attaches the uploaded video to the Strawberry product metadata.
 * Run with: pnpm medusa exec ./src/scripts/attach-video.ts
 */
import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

// ── Config ────────────────────────────────────────────────────────────────────
const PRODUCT_ID = "prod_01KJVABYVSMKJJWEQCE8QQESAX"

// Latest upload (most-recent timestamp wins).  Relative URL so it works
// regardless of whether the store is accessed via localhost or a tunnel.
const VIDEO_URL =
  "/static/video-1772922708328-prod_01KJVABYVSMKJJWEQCE8QQESAX.mp4"
// ─────────────────────────────────────────────────────────────────────────────

export default async function attachVideo({ container }: ExecArgs) {
  const productService = container.resolve(Modules.PRODUCT)

  // Fetch current metadata so we don't wipe other fields
  const [product] = await productService.listProducts(
    { id: [PRODUCT_ID] },
    { select: ["id", "metadata"] }
  )

  if (!product) {
    throw new Error(`Product ${PRODUCT_ID} not found`)
  }

  const existingMeta = (product.metadata as Record<string, unknown>) ?? {}

  // Parse any existing videoUrls
  let existingVideoUrls: string[] = []
  if (
    existingMeta.videoUrls &&
    typeof existingMeta.videoUrls === "string"
  ) {
    try {
      existingVideoUrls = JSON.parse(existingMeta.videoUrls)
    } catch {
      existingVideoUrls = []
    }
  }

  // Add the new URL only if it isn't already present
  if (!existingVideoUrls.includes(VIDEO_URL)) {
    existingVideoUrls.push(VIDEO_URL)
  }

  await productService.updateProducts(PRODUCT_ID, {
    metadata: {
      ...existingMeta,
      videoUrls: JSON.stringify(existingVideoUrls),
    },
  })

  console.log("✅ videoUrls updated:", JSON.stringify(existingVideoUrls))
}
