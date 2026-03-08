import { defineMiddlewares } from "@medusajs/framework/http"
import multer from "multer"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
})

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/products/:productId/videos",
      method: ["POST", "DELETE", "GET"],
      middlewares: [
        (req, res, next) => {
          // Log for debugging
          console.log(`Video API: ${req.method} ${req.path}`)
          next()
        },
      ],
    },
    {
      matcher: "/admin/products/:productId/videos",
      method: "POST",
      middlewares: [upload.single("video")],
    },
  ],
})
