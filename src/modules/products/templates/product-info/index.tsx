import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const metadata = product.metadata || {}

  let nutrition = null
  if (metadata.nutrition && typeof metadata.nutrition === 'string') {
    try {
      nutrition = JSON.parse(metadata.nutrition)
    } catch (e) {
      // If nutrition is not valid JSON, leave it as is
    }
  } else if (metadata.nutrition && typeof metadata.nutrition === 'object') {
    nutrition = metadata.nutrition
  }

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>

        {/* Product Metadata */}
        <div className="flex flex-col gap-y-3 py-4 border-t border-ui-border-base">
          {metadata.flavor && (
            <div>
              <Text className="text-sm font-semibold text-ui-fg-base">Flavor</Text>
              <Text className="text-sm text-ui-fg-subtle">{metadata.flavor}</Text>
            </div>
          )}

          {metadata.ingredients && (
            <div>
              <Text className="text-sm font-semibold text-ui-fg-base">Ingredients</Text>
              <Text className="text-sm text-ui-fg-subtle">{metadata.ingredients}</Text>
            </div>
          )}

          {metadata.attributes && (
            <div>
              <Text className="text-sm font-semibold text-ui-fg-base">Attributes</Text>
              <Text className="text-sm text-ui-fg-subtle">{metadata.attributes}</Text>
            </div>
          )}

          {metadata.netWeight && (
            <div>
              <Text className="text-sm font-semibold text-ui-fg-base">Net Weight</Text>
              <Text className="text-sm text-ui-fg-subtle">{metadata.netWeight}</Text>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div>
              <Text className="text-sm font-semibold text-ui-fg-base">Tags</Text>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block px-2 py-1 bg-ui-bg-subtle text-xs text-ui-fg-subtle rounded"
                  >
                    {tag.value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {nutrition && (
            <div className="pt-3 border-t border-ui-border-base">
              <Text className="text-sm font-semibold text-ui-fg-base">Nutrition Facts</Text>
              <div className="mt-2 text-xs text-ui-fg-subtle space-y-1">
                <div>Servings: {nutrition.servings || "N/A"}</div>
                <div>Serving Size: {nutrition.servingSize || "N/A"}</div>
                <div className="pt-2 border-t border-ui-border-base">
                  <div className="font-semibold">Amount per serving:</div>
                  <div>Calories: {nutrition.calories || "N/A"}</div>
                  <div>Total Fat: {nutrition.totalFat || "N/A"}</div>
                  <div className="ml-4">Saturated Fat: {nutrition.saturatedFat || "N/A"}</div>
                  <div className="ml-4">Trans Fat: {nutrition.transFat || "N/A"}</div>
                  <div>Cholesterol: {nutrition.cholesterol || "N/A"}</div>
                  <div>Sodium: {nutrition.sodium || "N/A"}</div>
                  <div>Total Carbs: {nutrition.totalCarbs || "N/A"}</div>
                  <div className="ml-4">Fiber: {nutrition.fiber || "N/A"}</div>
                  <div className="ml-4">Total Sugars: {nutrition.totalSugars || "N/A"}</div>
                  <div className="ml-8">Added Sugars: {nutrition.addedSugars || "N/A"}</div>
                  <div>Protein: {nutrition.protein || "N/A"}</div>
                </div>
              </div>
            </div>
          )}

          {metadata.storage && (
            <div className="pt-3 border-t border-ui-border-base">
              <Text className="text-sm font-semibold text-ui-fg-base">Storage</Text>
              <Text className="text-sm text-ui-fg-subtle">{metadata.storage}</Text>
            </div>
          )}

          {metadata.longDescription && (
            <div className="pt-3 border-t border-ui-border-base">
              <Text className="text-sm font-semibold text-ui-fg-base">About This Product</Text>
              <Text className="text-sm text-ui-fg-subtle whitespace-pre-line">{metadata.longDescription}</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
