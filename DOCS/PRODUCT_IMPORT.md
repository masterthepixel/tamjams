# Tam's Jams - Product Import Guide

This guide explains how to import the 7 jam products into your Medusa backend.

## Quick Start

**Step 1: Ensure Medusa Backend is Running**

```bash
cd backend
pnpm dev
```

Wait for the message: `🎉 Server is ready on port 9000` (or similar)

**Step 2: Run the Import Script**

In a new terminal window:

```bash
cd backend
pnpm import:products
```

The script will:
- ✅ Connect to the Medusa API
- ✅ Create/fetch the "Tam's Jams" collection
- ✅ Create 7 products (Blueberry, Strawberry, Raspberry, Apricot, Apple, Sour Cherry, Quince)
- ✅ Add variants with pricing ($9.99 USD each)
- ✅ Store ingredient and nutrition information as metadata

**Step 3: Verify in Admin Dashboard**

Navigate to: http://localhost:9000/app/products

You should see all 7 jam products listed with:
- Product title
- Flavor
- SKU
- Pricing
- Metadata (ingredients, attributes, net weight)

**Step 4: View on Storefront**

Visit: http://localhost:8000

Browse the products catalog and see your jams displayed!

## Product Data

All product data is stored in `/DOCS/product-data.json` and includes:

### Per-Product Fields
- **Title** - e.g., "Tam's Jams - Blueberry"
- **Handle** - URL slug (e.g., "tams-jams-blueberry")
- **Description** - Short description for product listing
- **Flavor** - Jam flavor type
- **Ingredients** - List of ingredients
- **Net Weight** - 12 oz / 340 g (standard for all)
- **Attributes** - Real Fruit, Non-GMO, Homemade, No Additives
- **Nutrition Facts** - Identical for all flavors:
  - 35 calories per tbsp
  - 9g carbs
  - 8g added sugars
  - Refrigerate after opening
- **SKU** - Unique identifier for inventory

### Brand Information
- **Story** - The heritage and origin story of Tam's Jams
- **Founded by** - Tamara (Armenian immigrant)
- **Mission** - Celebrating family, heritage, and second chances

## Ingredients by Flavor

| Flavor | Main Ingredients |
|--------|-----------------|
| Blueberry | Blueberries, Cane Sugar, Lemon Juice, Water |
| Strawberry | Strawberries, Cane Sugar, Lemon Juice, Water |
| Raspberry | Raspberries, Cane Sugar, Lemon Juice, Water |
| Apricot | Apricots, Cane Sugar, Lemon Juice, Water |
| Apple | Apple, Cane Sugar, Lemon Juice, Water |
| Sour Cherry | Sour Cherry, Cane Sugar, Lemon Juice, Water |
| Quince | **Quince, Cane Sugar, Lemon Juice, Cinnamon**, Water |

**Note:** Only Quince includes cinnamon as a special ingredient.

## Troubleshooting

### "Cannot connect to Medusa API"
- Ensure backend is running: `cd backend && pnpm dev`
- Check that port 9000 is accessible
- Wait a few seconds for the server to fully start

### "Products already exist"
- The script checks for existing products and skips them
- No duplicate products will be created
- If you need to reimport, delete products manually in the admin dashboard first

### "Could not create variant" or "Could not create collection"
- This is a warning and doesn't prevent product creation
- Products are still created, but may need manual variant/collection setup
- Try creating variants manually in the admin dashboard

### Missing metadata or ingredients
- Check that the import script completed successfully
- Verify the JSON file at `/DOCS/product-data.json` is valid
- Try importing again

## Manual Alternative

If the script doesn't work, you can manually create products:

1. Visit http://localhost:9000/app/products
2. Click "Create Product"
3. Fill in the details from `product-data.json`
4. Add variants with $9.99 USD pricing
5. Add metadata for ingredients and nutrition info

## Next Steps

After importing products:

1. **Add Images** - Upload product images in the admin dashboard
2. **Create Collections** - Organize products by type/flavor
3. **Set Up Pricing** - Adjust prices as needed
4. **Configure Shipping** - Set shipping zones and rates
5. **Connect Payment Gateway** - Set up Stripe for payments

## File References

- **Product Data:** `/DOCS/product-data.json`
- **Import Script:** `/backend/scripts/import-products.js`
- **Label PDFs:** `/DOCS/labels/` (design reference)

## Support

For issues with the import process:
- Check the console output for error messages
- Ensure the backend is responding (curl http://localhost:9000/health)
- Verify product-data.json is valid JSON
- Check that axios is installed (pnpm add axios)
