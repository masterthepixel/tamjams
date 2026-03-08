import { clsx } from "clsx"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex gap-x-2">
      {price.price_type === "sale" && (
        <span
          className="line-through text-olive-400"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={clsx("text-olive-950 dark:text-white font-semibold", {
          "text-red-700 dark:text-red-400": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </div>
  )
}
