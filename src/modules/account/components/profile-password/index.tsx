"use client"

import React, { useEffect, useActionState } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const updatePassword = async () => {
    // Current starter doesn't have a direct password update action exposed in customer data
    console.info("Password update is not currently implemented in the data layer")
  }

  const clearState = () => {
    setSuccessState(false)
  }

  return (
    <form
      action={updatePassword}
      onReset={() => clearState()}
      className="w-full"
    >
      <AccountInfo
        label="Password"
        currentInfo={
          <span className="text-olive-400 italic font-normal">••••••••••••</span>
        }
        isSuccess={successState}
        isError={false}
        errorMessage={undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Old Password"
            name="old_password"
            required
            type="password"
            data-testid="old-password-input"
          />
          <div className="md:col-start-1">
            <Input
              label="New Password"
              type="password"
              name="new_password"
              required
              data-testid="new-password-input"
            />
          </div>
          <div>
            <Input
              label="Confirm Password"
              type="password"
              name="confirm_password"
              required
              data-testid="confirm-password-input"
            />
          </div>
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
