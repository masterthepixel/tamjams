import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  // force local file service so uploads land in the mounted volume
  // (Railway provides a volume at /app/backend/static via RAILWAY_VOLUME_MOUNT_PATH)
  plugins: [
    {
      resolve: "@medusajs/file",
      options: {
        provider: "local",
        local: {
          directory:
            process.env.RAILWAY_VOLUME_MOUNT_PATH ||
            process.env.FILE_SERVICE_LOCAL_DIRECTORY ||
            "static",
        },
      },
    },
  ],
})
