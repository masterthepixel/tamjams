"use client"

import React, { useEffect, useActionState } from "react";
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const updateCustomerEmail = (
    _currentState: { success: boolean; error: string | null },
    _formData: FormData
  ) => {
    // Current Medusa v2 starter logic placeholder
    return { success: true, error: null }
  }

  const [state, formAction] = useActionState(updateCustomerEmail, {
    error: null,
    success: false,
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    if (state.success) {
      setSuccessState(true)
    }
  }, [state.success])

  return (
    <form action={formAction} className="w-full">
      <AccountInfo
        label="Email Address"
        currentInfo={`${customer.email}`}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error ?? "An error occurred"}
        clearState={clearState}
        data-testid="account-email-editor"
      >
        <div className="grid grid-cols-1">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={customer.email}
            data-testid="email-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileEmail
