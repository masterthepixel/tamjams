# Feature Epic: 3D Product Models (Interactive, Rotatable, Zoomable)

## Overview
We want to elevate the product experience by allowing each jam SKU to display a
3‑D model of its jar.  Shoppers should be able to rotate the jar on its axis,
zoom in/out, and, on capable devices, enter an AR view.  Models will be unique
per product (7 current jam varieties), with the glass jar shape common but the
label texture swapped out.

The backend simply stores a file URL or asset reference; the frontend renders a
viewer component that handles interaction.  Mobile support and performance will
be first‑class.

---

## User Stories

1. **As a merchant**, I can upload or link a 3D model file for each product (e.g.
   `.glb` with the jar base, texture applied using the label provided) so that
   my catalog displays interactive objects.

2. **As a shopper**, I can rotate the 3D jar with a drag gesture or mouse, pinch
   to zoom, and tap a control to view it in AR (iOS/Android) when available.

3. **As a shopper on mobile**, the model loads quickly, fits the screen, and
   responds smoothly to touch – there’s no lag or overwhelming data usage.

4. **As a developer**, I can fetch the `product.media` array and see entries with
   `type: 'model'` (or `media.type === 'model' && modelUrl`) so I know when to
   render the viewer component.

5. **As a developer**, I can seed the database with dummy GLB models and run
   integration tests that assert the store response includes them.

6. **As a UX designer**, I can supply a single blank jar model plus seven label
   textures and stitch them server‑side or pre‑bake them for each product.

---

## Technical Tasks

- **Data model & storage**
  - Extend the `product_media` proposal (from the carousel epic) to allow
    `type: 'model'` and include optional `poster` (thumbnail) and `format`.
  - Decide whether to store a generic jar model and apply different textures via
    metadata, or upload seven separate `.glb` files.  (Metadata route easier).
  - Add migrations/ORM metadata and update seed script accordingly.

- **Backend API**
  - Ensure admin and store endpoints return model URLs alongside images/videos.
  - Provide a simple way to upload or reference the GLB/USDC/OBJ file (could be
    via existing file‑upload plugin, or through metadata if you host models on
    S3).

- **Frontend components**
  - Create `<ProductModelViewer>` component.
  - Use [`<model-viewer>`](https://modelviewer.dev/) for a lightweight path; it
    already supports rotation, zoom, pan, and AR on mobile.  OR use
    `react-three-fiber` for custom experiences.
  - Enhance `MediaGallery` to conditionally insert the viewer when
    `media.type === 'model'`.
  - Add zoom/rotate controls, overlay instructions for first‑time users.
  - On mobile, make it full‑screen on interaction and support AR button if
    `model-viewer` detects `ios-src`/`ar` attributes.

- **Assets & CMS**
  - Decide how to generate or host models; merchant provides jar label design
    which can be wrapped on the 3D mesh.
  - Possibly integrate a build step that merges label texture with base jar
    model to produce per‑product `.glb` files.

- **Seeding & tests**
  - Update `backend/src/scripts/seed-products.ts` to add a `media` entry of type
    `'model'` pointing to an example GLB (could be stored under `static/` or a
    placeholder URL).  Include a poster thumbnail in metadata.
  - Add backend service tests verifying `MediaService` handles models.
  - Add integration test for `/store/products` returning a model object.
  - Add frontend component tests that `<ProductModelViewer>` renders a
    `<model-viewer>` and responds to drag/zoom events (snapshot or jest-dom).

- **Performance considerations**
  - Lazy‑load the 3D asset only when the viewer scrolls into view.
  - Provide compressed/draco‑encoded models to keep file size small (<1 MB).
  - Provide fallbacks to a static image if WebGL isn't available.

- **UX/Accessibility**
  - Add alt text or aria labels describing the object and interaction hints.
  - Provide a “view gallery” button for keyboard users that toggles focus into
    the viewer and provides instructions for rotating via arrow keys.

---

## Acceptance Criteria

- Products can have one or more media entries of `type:'model'`.
- Store API returns model entries with `url` and optional `poster`/`format`.
- Frontend gallery renders a fully interactive, touch‑friendly 3D viewer.
- Mobile devices show a usable experience and support AR invocation.
- A merchant can update and re‑order models just as with images/videos.
- 7 jam products can each display their own jar model with appropriate label.
- Documentation in the `DOCS` folder explains how to add/maintain models.

---

## Notes & references

- Leverages the same underlying media system proposed in the
  **Product Media Carousel** epic; treat models as a new subtype.
- [`<model-viewer>`](https://modelviewer.dev/) is the recommended component
  because it handles rotation, zooming, AR, and mobile performance out of the
  box; it is maintained by Google and open source.
- Example GLB: use an exported jar from Blender or an online model library,
  then apply the jam label texture in your asset pipeline.
- AR fallbacks: provide `ios-src` for USDZ if wanting Apple AR Quick Look.

By keeping the pattern consistent (media table → front‑end gallery), the
implementation surface is moderate but provides an eye‑catching marketing
upgrade to the product pages.