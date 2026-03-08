import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import {
  NavbarWithLinksActionsAndCenteredLogo,
  NavbarLink,
  NavbarLogo
} from "@components/oatmeal/sections/navbar-with-links-actions-and-centered-logo"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  const links = (
    <>
      <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
      <NavbarLink href="/store">Store</NavbarLink>
    </>
  )

  const logo = (
    <NavbarLogo href="/">
      <span className="text-xl font-display uppercase tracking-wider text-olive-950 dark:text-white">
        Medusa Store
      </span>
    </NavbarLogo>
  )

  const actions = (
    <>
      <NavbarLink href="/account" className="hidden small:inline-flex">
        Account
      </NavbarLink>
      <Suspense
        fallback={
          <LocalizedClientLink
            className="hover:text-ui-fg-base flex gap-2"
            href="/cart"
            data-testid="nav-cart-link"
          >
            Cart (0)
          </LocalizedClientLink>
        }
      >
        <CartButton />
      </Suspense>
    </>
  )

  return (
    <NavbarWithLinksActionsAndCenteredLogo
      links={links}
      logo={logo}
      actions={actions}
    />
  )
}
