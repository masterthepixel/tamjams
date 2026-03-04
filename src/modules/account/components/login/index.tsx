import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { clsx } from "clsx"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-4xl font-display text-olive-950 dark:text-white uppercase tracking-wider mb-2 text-center">
        Welcome back
      </h1>
      <p className="text-center text-sm text-olive-600 dark:text-olive-400 mb-10 max-w-[280px]">
        Sign in to access an enhanced shopping experience.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full h-12 mt-8 text-base">
          Sign in
        </SubmitButton>
      </form>
      <div className="text-center mt-8 pt-8 border-t border-olive-200 dark:border-olive-800 w-full">
        <p className="text-sm text-olive-600 dark:text-olive-400">
          Not a member?{" "}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className="font-semibold text-olive-950 dark:text-white underline underline-offset-4 hover:text-olive-700 dark:hover:text-olive-200 transition-colors duration-200"
            data-testid="register-button"
          >
            Join us
          </button>
          .
        </p>
      </div>
    </div>
  )
}

export default Login
