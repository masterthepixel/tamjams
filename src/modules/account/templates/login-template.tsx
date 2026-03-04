"use client"

import { useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import { clsx } from "clsx"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full min-h-[calc(100vh-150px)] flex items-center justify-center px-6 py-12 lg:py-24 bg-olive-50 dark:bg-olive-950">
      <div className="max-w-xl w-full bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-800 rounded-3xl p-8 lg:p-12 shadow-sm transition-all duration-300">
        {currentView === "sign-in" ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  )
}

export default LoginTemplate
