"use client"

import { RepeatIcon } from "@components/oatmeal/icons/repeat-icon"
import { RocketIcon } from "@components/oatmeal/icons/rocket-icon"
import { ArrowNarrowLeftIcon } from "@components/oatmeal/icons/arrow-narrow-left-icon"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Product Information",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-sm py-4">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-olive-950 dark:text-white">Material</span>
            <p className="text-olive-600 dark:text-olive-400">{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-olive-950 dark:text-white">Country of origin</span>
            <p className="text-olive-600 dark:text-olive-400">{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-olive-950 dark:text-white">Type</span>
            <p className="text-olive-600 dark:text-olive-400">{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-olive-950 dark:text-white">Weight</span>
            <p className="text-olive-600 dark:text-olive-400">{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-olive-950 dark:text-white">Dimensions</span>
            <p className="text-olive-600 dark:text-olive-400">
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-sm py-4">
      <div className="grid grid-cols-1 gap-y-6">
        <div className="flex items-start gap-x-3">
          <RocketIcon className="size-5 text-olive-950 dark:text-white" />
          <div>
            <span className="font-semibold text-olive-950 dark:text-white">Fast delivery</span>
            <p className="max-w-sm text-olive-600 dark:text-olive-400">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <RepeatIcon className="size-5 text-olive-950 dark:text-white" />
          <div>
            <span className="font-semibold text-olive-950 dark:text-white">Simple exchanges</span>
            <p className="max-w-sm text-olive-600 dark:text-olive-400">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <ArrowNarrowLeftIcon className="size-5 text-olive-950 dark:text-white" />
          <div>
            <span className="font-semibold text-olive-950 dark:text-white">Easy returns</span>
            <p className="max-w-sm text-olive-600 dark:text-olive-400">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
