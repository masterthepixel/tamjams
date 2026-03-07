import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductActionsWrapper from "./product-actions-wrapper"
import { MediaItem } from "@lib/util/combine-product-media"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  media: MediaItem[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  media,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="bg-white dark:bg-olive-950 min-h-screen">
      <div className="content-container max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* Left Column: Image Gallery — first in DOM so it renders above text on mobile */}
          <div className="xl:sticky xl:top-24">
            <ImageGallery images={media} />
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="flex flex-col gap-y-8 mt-10 lg:mt-0">
            <nav aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-2">
                {product.collection && (
                  <li>
                    <div className="flex items-center text-sm">
                      <LocalizedClientLink
                        href={`/collections/${product.collection.handle}`}
                        className="font-medium text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white transition-colors"
                      >
                        {product.collection.title}
                      </LocalizedClientLink>
                      <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="ml-2 size-5 shrink-0 text-olive-300 dark:text-olive-700"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    </div>
                  </li>
                )}
                <li className="text-sm font-medium text-olive-400 dark:text-olive-600 truncate max-w-[200px]">
                  {product.title}
                </li>
              </ol>
            </nav>

            <ProductInfo product={product} />

            <div className="flex flex-col gap-y-8">
              <ProductOnboardingCta />
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>

              <div className="border-t border-olive-200 dark:border-olive-800 pt-8 w-full">
                <ProductTabs product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="content-container max-w-7xl mx-auto my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
