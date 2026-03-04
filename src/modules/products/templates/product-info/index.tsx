import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clsx } from "clsx"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const metadata = product.metadata || {}

  let nutrition = null
  if (metadata.nutrition && typeof metadata.nutrition === "string") {
    try {
      nutrition = JSON.parse(metadata.nutrition)
    } catch (e) {
      // If nutrition is not valid JSON, leave it as is
    }
  } else if (metadata.nutrition && typeof metadata.nutrition === "object") {
    nutrition = metadata.nutrition
  }

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-sm font-medium text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white transition-colors duration-200"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <h2
          className="text-4xl font-display text-olive-950 dark:text-white"
          data-testid="product-title"
        >
          {product.title}
        </h2>

        <p
          className="text-base text-olive-700 dark:text-olive-300 whitespace-pre-line leading-relaxed"
          data-testid="product-description"
        >
          {product.description}
        </p>

        {/* Product Metadata */}
        <div className="flex flex-col gap-y-4 py-6 border-t border-olive-200 dark:border-olive-800">
          {metadata.flavor && (
            <div>
              <span className="text-sm font-semibold text-olive-950 dark:text-white">Flavor</span>
              <p className="text-sm text-olive-600 dark:text-olive-400">{metadata.flavor as string}</p>
            </div>
          )}

          {metadata.ingredients && (
            <div>
              <span className="text-sm font-semibold text-olive-950 dark:text-white">Ingredients</span>
              <p className="text-sm text-olive-600 dark:text-olive-400">{metadata.ingredients as string}</p>
            </div>
          )}

          {metadata.netWeight && (
            <div>
              <span className="text-sm font-semibold text-olive-950 dark:text-white">Net Weight</span>
              <p className="text-sm text-olive-600 dark:text-olive-400">{metadata.netWeight as string}</p>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div>
              <span className="text-sm font-semibold text-olive-950 dark:text-white">Tags</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block px-2 py-1 bg-olive-950/5 dark:bg-white/5 text-xs text-olive-600 dark:text-olive-400 rounded-full"
                  >
                    {tag.value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {nutrition && (
            <div className="pt-4 border-t border-olive-200 dark:border-olive-800">
              <span className="text-sm font-semibold text-olive-950 dark:text-white font-display">Nutrition Facts</span>
              <div className="mt-2 text-xs text-olive-600 dark:text-olive-400 space-y-1">
                <div>Servings: {nutrition.servings || "N/A"}</div>
                <div>Serving Size: {nutrition.servingSize || "N/A"}</div>
                <div className="pt-2 border-t border-olive-200 dark:border-olive-800 mt-2">
                  <div className="font-semibold text-olive-950 dark:text-white">Amount per serving:</div>
                  <div className="flex justify-between"><span>Calories</span> <span>{nutrition.calories || "N/A"}</span></div>
                  <div className="flex justify-between"><span>Total Fat</span> <span>{nutrition.totalFat || "N/A"}</span></div>
                  <div className="flex justify-between ml-4"><span>Saturated Fat</span> <span>{nutrition.saturatedFat || "N/A"}</span></div>
                  <div className="flex justify-between"><span>Total Carbs</span> <span>{nutrition.totalCarbs || "N/A"}</span></div>
                  <div className="flex justify-between ml-4"><span>Total Sugars</span> <span>{nutrition.totalSugars || "N/A"}</span></div>
                  <div className="flex justify-between"><span>Protein</span> <span>{nutrition.protein || "N/A"}</span></div>
                </div>
              </div>
            </div>
          )}

          {metadata.storage && (
            <div className="pt-4 border-t border-olive-200 dark:border-olive-800">
              <span className="text-sm font-semibold text-olive-950 dark:text-white">Storage</span>
              <p className="text-sm text-olive-600 dark:text-olive-400">{metadata.storage as string}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
