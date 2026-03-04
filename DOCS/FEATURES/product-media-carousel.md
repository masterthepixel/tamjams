# Feature Epic: Product Media Carousel (Images + Videos)

## Overview
We want to empower merchants to attach a rich media gallery to each product, not
just static images.  The product page should present a carousel that can show
an arbitrary sequence of images and videos (hosted files or external URLs).  The
backend will store and serve both photos and video URLs, the admin should be
able to upload or link them, and the frontend must render them seamlessly with
playback controls for video elements.

This epic corresponds to the earlier research note in the docs; it formalizes
the story for developers and product managers.

---

## User Stories

1. **As a merchant**, I can upload photos _and_ video files to a product so that
   shoppers see demo reels or usage clips without leaving the page.

2. **As a merchant**, I can re-order media items and decide which one appears
   first in the carousel (whether image or video), and also remove/replace them.

3. **As a shopper**, I can swipe/click through a carousel of media on a product
   page.  Images display normally; videos autoplay on click or show a play icon
   and stream via `<video>` controls.

4. **As a developer**, I can fetch a product's media list via the store API
   (`/store/products/:handle`) and receive type information so I know whether to
   render an `<img>` or `<video>`.

5. **As a developer**, I can seed the database with media entries during
   testing and include sample videos in integration tests.

---

## Technical Tasks

- **Data model**
  - Create a `product_media` table/entity or extend the existing
    `product_images` table with a `type` and `url` field.  Possibly create a
    custom module named `media` and link it to `product`.
  - Add migrations, update ORM models and DTOs.

- **Backend API**
  - Update admin endpoints to support `POST`, `PATCH`, `DELETE` media entries.
  - Modify store endpoints to return `media: MediaDTO[]` when `?fields=+media` or
    `+images` is requested (backwards‑compatible).
  - Add service and workflow methods mirroring `ProductImageService`.

- **Admin UI**
  - (Optional) Patch the Admin dashboard to provide a media manager for products
    allowing upload/linking of videos.  Alternatively, document API calls for
    manual management.

- **Frontend components**
  - Rename `ImageGallery` → `MediaGallery`.  Accept a union type
    `{id:string;url:string;type:'image'|'video';rank:number}`.
  - Implement carousel behaviour supporting a mix of `img` and `video` nodes.
  - Ensure accessibility (play button, alt text, captions).
  - Add preview thumbnails if desired.

- **Seeding & migration scripts**
  - Extend `backend/src/scripts/seed-products.ts` to optionally insert
    `media` entries with video URLs for testing.
  - Possibly create a new script `add-product-media.ts`.

- **Testing**
  - Write backend unit tests for media service and API routes.
  - Add integration tests for the store route returning mixed media.
  - Add frontend snapshot tests for `MediaGallery` rendering video and image.

---

## Acceptance Criteria

- A new product media entry can be created via API with `type` and `url`.
- Store API returns a `media` array containing objects with `type`.
- Frontend carousel renders videos with controls and images with `next/image`.
- Migration and seed scripts produce working media on local development.
- Documentation (this feature spec and any README updates) explains how to
  configure and consume the feature.

---

## Notes & References

- Current system stores images only; adding a new type requires DB migration or
  metadata hack.
- A lightweight path using `metadata.videoUrls` exists if we need minimal work.
- Medusa docs on **extending the product model** are applicable:
  https://docs.medusajs.com/resources/commerce-modules/product/extend

This epic lives alongside other feature ideas in the `DOCS/FEATURES` folder and
serves as the planning foundation for future development.