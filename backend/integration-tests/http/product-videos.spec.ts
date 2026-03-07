import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  inApp: true,
  env: {},
  testSuite: ({ api }) => {
    describe("Store API - Product Videos", () => {
      it("should return metadata.videoUrls when fields=+metadata", async () => {
        // This test will pass after implementation
        const response = await api.get(
          `/store/products?handle=tams-jams-strawberry&fields=+metadata`
        )

        expect(response.status).toEqual(200)
        const { products } = response.body

        expect(products).toBeDefined()
        expect(products.length).toBeGreaterThan(0)

        const product = products[0]
        expect(product.metadata).toBeDefined()
        expect(product.metadata.videoUrls).toBeDefined()
      })

      it("should stringify videoUrls in API response", async () => {
        const response = await api.get(
          `/store/products?handle=tams-jams-strawberry&fields=+metadata`
        )

        expect(response.status).toEqual(200)
        const { products } = response.body
        const product = products[0]

        if (product.metadata.videoUrls) {
          expect(typeof product.metadata.videoUrls).toBe("string")
          const parsed = JSON.parse(product.metadata.videoUrls)
          expect(Array.isArray(parsed)).toBe(true)
        }
      })

      it("should work with products that have no videos", async () => {
        const response = await api.get(`/store/products?fields=+metadata`)

        expect(response.status).toEqual(200)
        const { products } = response.body

        products.forEach((product: any) => {
          if (product.metadata?.videoUrls) {
            expect(typeof product.metadata.videoUrls).toBe("string")
          }
        })
      })
    })
  },
})
