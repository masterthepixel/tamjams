"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { clsx } from "clsx"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-4xl font-display text-olive-950 dark:text-white uppercase tracking-wider mb-2 text-center">
        Join Medusa
      </h1>
      <p className="text-center text-sm text-olive-600 dark:text-olive-400 mb-10 max-w-[320px]">
        Create your Member profile and get access to an enhanced shopping experience.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              name="first_name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
            <Input
              label="Last name"
              name="last_name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
          </div>
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <div className="text-center mt-6">
          <p className="text-xs text-olive-600 dark:text-olive-500 leading-relaxed">
            By creating an account, you agree to Medusa Store&apos;s{" "}
            <LocalizedClientLink
              href="/content/privacy-policy"
              className="underline hover:text-olive-950 dark:hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </LocalizedClientLink>{" "}
            and{" "}
            <LocalizedClientLink
              href="/content/terms-of-use"
              className="underline hover:text-olive-950 dark:hover:text-white transition-colors duration-200"
            >
              Terms of Use
            </LocalizedClientLink>
            .
          </p>
        </div>
        <SubmitButton className="w-full h-12 mt-8 text-base" data-testid="register-button">
          Join us
        </SubmitButton>
      </form>
      <div className="text-center mt-8 pt-8 border-t border-olive-200 dark:border-olive-800 w-full">
        <p className="text-sm text-olive-600 dark:text-olive-400">
          Already a member?{" "}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className="font-semibold text-olive-950 dark:text-white underline underline-offset-4 hover:text-olive-700 dark:hover:text-olive-200 transition-colors duration-200"
          >
            Sign in
          </button>
          .
        </p>
      </div>
    </div>
  )
}

export default Register
