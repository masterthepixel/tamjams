import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import {
  FooterWithNewsletterFormCategoriesAndSocialIcons,
  FooterCategory,
  FooterLink,
  SocialLink,
  NewsletterForm
} from "@components/oatmeal/sections/footer-with-newsletter-form-categories-and-social-icons"
import { GitHubIcon } from "@components/oatmeal/icons/social/github-icon"
import { XIcon } from "@components/oatmeal/icons/social/x-icon"
import { InstagramIcon } from "@components/oatmeal/icons/social/instagram-icon"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  const cta = (
    <NewsletterForm
      headline="Stay in the loop"
      subheadline="Be the first to hear about new products, collections, and exclusive offers."
    />
  )

  const links = (
    <>
      <FooterCategory title="Categories">
        {productCategories?.slice(0, 6).map((c) => (
          <FooterLink key={c.id} href={`/categories/${c.handle}`}>
            {c.name}
          </FooterLink>
        ))}
      </FooterCategory>
      <FooterCategory title="Collections">
        {collections?.slice(0, 6).map((c) => (
          <FooterLink key={c.id} href={`/collections/${c.handle}`}>
            {c.title}
          </FooterLink>
        ))}
      </FooterCategory>
      <FooterCategory title="Medusa">
        <FooterLink href="https://github.com/medusajs">GitHub</FooterLink>
        <FooterLink href="https://docs.medusajs.com">Documentation</FooterLink>
        <FooterLink href="https://github.com/medusajs/nextjs-starter-medusa">Source code</FooterLink>
      </FooterCategory>
    </>
  )

  const fineprint = (
    <div className="flex flex-col gap-2">
      <p>© {new Date().getFullYear()} Medusa Store. All rights reserved.</p>
      <MedusaCTA />
    </div>
  )

  const socialLinks = (
    <>
      <SocialLink href="https://x.com/medusajs" name="X">
        <XIcon />
      </SocialLink>
      <SocialLink href="https://github.com/medusajs" name="GitHub">
        <GitHubIcon />
      </SocialLink>
      <SocialLink href="https://instagram.com/medusajs" name="Instagram">
        <InstagramIcon />
      </SocialLink>
    </>
  )

  return (
    <FooterWithNewsletterFormCategoriesAndSocialIcons
      cta={cta}
      links={links}
      fineprint={fineprint}
      socialLinks={socialLinks}
    />
  )
}
