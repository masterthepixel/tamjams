import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="flex items-start relative w-full">
      <div className="flex flex-col flex-1 gap-y-6">
        {images.map((image, index) => {
          return (
            <div
              key={image.id}
              className="relative aspect-square w-full overflow-hidden bg-olive-50 dark:bg-olive-900/50 rounded-3xl border border-olive-200 dark:border-olive-800 shadow-sm"
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 1}
                  className="absolute inset-0 object-cover"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 100vw, (max-width: 1024px) 50vw, 800px"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
