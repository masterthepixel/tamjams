import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clsx } from "clsx"
import ProductPrice from "@modules/products/components/product-price"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const metadata = product.metadata || {}

  let nutrition: any = null
  let isRawString = false

  if (metadata.nutrition && typeof metadata.nutrition === "string") {
    try {
      nutrition = JSON.parse(metadata.nutrition)
    } catch (e) {
      // If nutrition is not valid JSON, treat it as a raw string
      nutrition = metadata.nutrition
      isRawString = true
    }
  } else if (metadata.nutrition && typeof metadata.nutrition === "object") {
    nutrition = metadata.nutrition
  }

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-6 lg:max-w-[500px] mx-auto">
        <div className="flex flex-col gap-y-2">
          {product.collection && (
            <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="text-sm font-medium text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white transition-colors duration-200"
            >
              {product.collection.title}
            </LocalizedClientLink>
          )}
          <h2
            className="text-4xl font-display text-olive-950 dark:text-white leading-tight"
            data-testid="product-title"
          >
            {product.title}
          </h2>
          <div className="flex items-center gap-x-2 mt-1">
            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-olive-600 dark:text-olive-400">
              In stock
            </span>
          </div>
          <div className="pt-4">
            <ProductPrice product={product} />
          </div>
        </div>

        <p
          className="text-lg text-olive-800 dark:text-olive-200 whitespace-pre-line leading-relaxed"
          data-testid="product-description"
        >
          {product.description}
        </p>

        {/* Product Metadata */}
        <div className="grid grid-cols-1 gap-y-6 py-8 border-t border-olive-200 dark:border-olive-800">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Boolean(metadata.flavor) && (
              <div className="flex flex-col gap-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-olive-400 dark:text-olive-600">Flavor</span>
                <p className="text-sm font-medium text-olive-950 dark:text-white">{metadata.flavor as string}</p>
              </div>
            )}

            {Boolean(metadata.netWeight) && (
              <div className="flex flex-col gap-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-olive-400 dark:text-olive-600">Net Weight</span>
                <p className="text-sm font-medium text-olive-950 dark:text-white">{metadata.netWeight as string}</p>
              </div>
            )}

            {Boolean(metadata.storage) && (
              <div className="flex flex-col gap-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-olive-400 dark:text-olive-600">Storage</span>
                <p className="text-sm font-medium text-olive-950 dark:text-white">{metadata.storage as string}</p>
              </div>
            )}
          </div>

          {Boolean(metadata.ingredients) && (
            <div className="pt-6 border-t border-olive-100 dark:border-olive-900">
              <span className="text-xs font-bold uppercase tracking-wider text-olive-400 dark:text-olive-600">Ingredients</span>
              <p className="mt-2 text-sm text-olive-600 dark:text-olive-400 leading-relaxed">{metadata.ingredients as string}</p>
            </div>
          )}

          {Boolean(product.tags && product.tags.length > 0) && (
            <div className="pt-6 border-t border-olive-100 dark:border-olive-900">
              <span className="text-xs font-bold uppercase tracking-wider text-olive-400 dark:text-olive-600">Tags</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {product.tags!.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block px-3 py-1 bg-olive-50 dark:bg-olive-900/50 border border-olive-100 dark:border-olive-800 text-[10px] font-bold uppercase tracking-tight text-olive-600 dark:text-olive-400 rounded-lg"
                  >
                    {tag.value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {nutrition && isRawString && (
            <div className="pt-6 border-t border-olive-100 dark:border-olive-900">
              <span className="text-xs font-bold uppercase tracking-wider text-olive-400 dark:text-olive-600 mb-3 block">Nutrition Facts</span>
              <p className="mt-2 text-sm text-olive-600 dark:text-olive-400 leading-relaxed whitespace-pre-line">{nutrition}</p>
            </div>
          )}

          {nutrition && !isRawString && (
            <div className="pt-6 border-t border-olive-100 dark:border-olive-900">
              <span className="text-xs font-bold uppercase tracking-wider text-olive-400 dark:text-olive-600 mb-3 block">Nutrition Facts</span>
              <div className="bg-olive-50/50 dark:bg-olive-900/20 rounded-2xl p-4 border border-olive-100 dark:border-olive-800">
                <div className="flex justify-between text-xs text-olive-600 dark:text-olive-400 mb-3">
                  <span>Servings: {nutrition.servings || "N/A"}</span>
                  <span>Size: {nutrition.servingSize || "N/A"}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-olive-950 dark:text-white">Calories</span>
                    <span className="font-bold text-olive-950 dark:text-white">{nutrition.calories || "N/A"}</span>
                  </div>
                  <div className="h-px bg-olive-200 dark:bg-olive-800 my-2" />
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                    <div className="flex justify-between italic"><span>Total Fat</span> <span>{nutrition.totalFat || "0g"}</span></div>
                    <div className="flex justify-between italic"><span>Total Carbs</span> <span>{nutrition.totalCarbs || "0g"}</span></div>
                    <div className="flex justify-between ml-2 text-olive-500"><span>Sat. Fat</span> <span>{nutrition.saturatedFat || "0g"}</span></div>
                    <div className="flex justify-between ml-2 text-olive-500"><span>Sugars</span> <span>{nutrition.totalSugars || "0g"}</span></div>
                    <div className="flex justify-between italic"><span>Protein</span> <span>{nutrition.protein || "0g"}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
