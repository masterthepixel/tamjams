import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Only attempt to fetch if backend URL is configured and publishable key is available
    if (BACKEND_URL && PUBLISHABLE_API_KEY) {
      try {
        // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
        const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
          headers: {
            "x-publishable-api-key": PUBLISHABLE_API_KEY,
          },
          next: {
            revalidate: 3600,
            tags: [`regions-${cacheId}`],
          },
          cache: "force-cache",
        }).then(async (response) => {
          const json = await response.json()

          if (!response.ok) {
            throw new Error(json.message)
          }

          return json
        })

        if (regions?.length) {
          // Create a map of country codes to regions.
          regions.forEach((region: HttpTypes.StoreRegion) => {
            region.countries?.forEach((c) => {
              regionMapCache.regionMap.set(c.iso_2 ?? "", region)
            })
          })

          regionMapCache.regionMapUpdated = Date.now()
        }
      } catch (error) {
        // If backend is unavailable, fall back to default region
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "Middleware.ts: Could not fetch regions from backend. Using default region:",
            DEFAULT_REGION,
            error
          )
        }

        // Always ensure we have at least the default region
        if (!regionMapCache.regionMap.has(DEFAULT_REGION)) {
          regionMapCache.regionMap.set(DEFAULT_REGION, { id: DEFAULT_REGION } as any)
        }
        regionMapCache.regionMapUpdated = Date.now()
      }
    } else {
      // No backend URL or publishable key configured, use default region
      if (!regionMapCache.regionMap.has(DEFAULT_REGION)) {
        regionMapCache.regionMap.set(DEFAULT_REGION, { id: DEFAULT_REGION } as any)
      }
      regionMapCache.regionMapUpdated = Date.now()
    }
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else {
      // Fallback: use first available region or default
      const firstKey = regionMap.keys().next().value
      countryCode = firstKey || DEFAULT_REGION
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL.",
        error
      )
    }
    // Always return a valid country code even on error
    return DEFAULT_REGION
  }
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  // check if the url is a static asset
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

  // List of valid country codes to support
  const validCountryCodes = ["us", "uk", "ca", "eu"]

  let cacheIdCookie = request.cookies.get("_medusa_cache_id")
  let cacheId = cacheIdCookie?.value || crypto.randomUUID()

  // If URL already has a valid country code, allow it through
  if (urlCountryCode && validCountryCodes.includes(urlCountryCode)) {
    const response = NextResponse.next()
    if (!cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
    }
    return response
  }

  // Try to get the user's preferred region from backend
  try {
    const regionMap = await getRegionMap(cacheId)
    const countryCode = await getCountryCode(request, regionMap)

    if (!urlCountryCode && countryCode) {
      const redirectPath =
        request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
      const queryString = request.nextUrl.search || ""
      const redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`

      const response = NextResponse.redirect(redirectUrl, 307)
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
      return response
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Middleware error:", error)
    }
  }

  // Default: redirect to /us
  if (!urlCountryCode) {
    const redirectPath =
      request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
    const queryString = request.nextUrl.search || ""
    const redirectUrl = `${request.nextUrl.origin}/us${redirectPath}${queryString}`

    const response = NextResponse.redirect(redirectUrl, 307)
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|admin|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
