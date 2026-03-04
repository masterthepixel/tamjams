import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { HeroLeftAlignedWithDemo } from "@components/oatmeal/sections/hero-left-aligned-with-demo"
import { ButtonLink } from "@components/oatmeal/elements/button"

export const metadata: Metadata = {
  title: "TamsJam | Gourmet Jams & Preserves",
  description:
    "Delicious, handcrafted jams made with the finest local ingredients. Experience the taste of TamsJam.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <HeroLeftAlignedWithDemo
        eyebrow="Handcrafted in Small Batches"
        headline="Taste the essence of pure fruit."
        subheadline="From classic strawberry to exotic combinations, our jams are made with passion and preserve the natural goodness of every harvest."
        cta={
          <div className="flex gap-4">
            <ButtonLink href="/store" size="lg">
              Shop All
            </ButtonLink>
            <ButtonLink href="/about" size="lg" color="light">
              Our Story
            </ButtonLink>
          </div>
        }
      />
      <div className="bg-olive-100 dark:bg-olive-950">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
