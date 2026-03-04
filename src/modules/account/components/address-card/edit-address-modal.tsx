"use client"

import React, { useEffect, useState, useActionState } from "react"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"
import { clsx } from "clsx"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer"
import { Button } from "@components/oatmeal/elements/button"

type EditAddressProps = {
  region: HttpTypes.StoreRegion
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  region,
  address,
  isActive = false,
}) => {
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
    addressId: address.id,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className={clsx(
          "bg-white dark:bg-olive-900 border rounded-2xl p-6 min-h-[220px] h-full w-full flex flex-col justify-between transition-all duration-200",
          isActive
            ? "border-olive-950 dark:border-white ring-1 ring-olive-950 dark:ring-white"
            : "border-olive-100 dark:border-olive-800 hover:border-olive-300 dark:hover:border-olive-700 hover:shadow-sm"
        )}
        data-testid="address-container"
      >
        <div className="flex flex-col gap-y-3">
          <div className="flex items-start justify-between">
            <h3
              className="text-lg font-display text-olive-950 dark:text-white uppercase tracking-wider"
              data-testid="address-name"
            >
              {address.first_name} {address.last_name}
            </h3>
            {isActive && (
              <span className="text-[10px] font-bold text-olive-950 dark:text-white uppercase tracking-widest bg-olive-100 dark:bg-olive-800 px-2 py-1 rounded-md">Default</span>
            )}
          </div>

          <div className="flex flex-col gap-y-1 text-sm text-olive-600 dark:text-olive-400">
            {address.company && (
              <span className="font-medium text-olive-950 dark:text-white" data-testid="address-company">
                {address.company}
              </span>
            )}
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && `, ${address.address_2}`}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code} {address.city}
            </span>
            <span data-testid="address-province-country" className="font-semibold text-olive-400 dark:text-olive-500 uppercase tracking-widest text-[10px]">
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-x-4 pt-6 border-t border-olive-50 dark:border-olive-800/50 mt-4">
          <button
            className="text-xs font-semibold text-olive-600 dark:text-olive-400 flex items-center gap-x-2 hover:text-olive-950 dark:hover:text-white transition-colors"
            onClick={open}
            data-testid="address-edit-button"
          >
            <Edit className="size-4" />
            Edit
          </button>
          <button
            className="text-xs font-semibold text-olive-600 dark:text-olive-400 flex items-center gap-x-2 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            onClick={removeAddress}
            data-testid="address-delete-button"
          >
            {removing ? <Spinner className="size-4" /> : <Trash className="size-4" />}
            Remove
          </button>
        </div>
      </div>

      <Modal isOpen={state} close={close} data-testid="edit-address-modal">
        <Modal.Title>
          <h2 className="text-2xl font-display text-olive-950 dark:text-white uppercase tracking-widest mb-2">Edit Address</h2>
        </Modal.Title>
        <form action={formAction}>
          <input type="hidden" name="addressId" value={address.id} />
          <Modal.Body>
            <div className="flex flex-col gap-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  defaultValue={address.first_name || undefined}
                  data-testid="first-name-input"
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  defaultValue={address.last_name || undefined}
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Company"
                name="company"
                autoComplete="organization"
                defaultValue={address.company || undefined}
                data-testid="company-input"
              />
              <Input
                label="Address"
                name="address_1"
                required
                autoComplete="address-line1"
                defaultValue={address.address_1 || undefined}
                data-testid="address-1-input"
              />
              <Input
                label="Apartment, Suite, etc. (Optional)"
                name="address_2"
                autoComplete="address-line2"
                defaultValue={address.address_2 || undefined}
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Postal Code"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  defaultValue={address.postal_code || undefined}
                  data-testid="postal-code-input"
                />
                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="locality"
                  defaultValue={address.city || undefined}
                  data-testid="city-input"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Province / State"
                  name="province"
                  autoComplete="address-level1"
                  defaultValue={address.province || undefined}
                  data-testid="state-input"
                />
                <CountrySelect
                  name="country_code"
                  region={region}
                  required
                  autoComplete="country"
                  defaultValue={address.country_code || undefined}
                  data-testid="country-select"
                />
              </div>
              <Input
                label="Phone"
                name="phone"
                autoComplete="phone"
                defaultValue={address.phone || undefined}
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div className="mt-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900/30 p-3 rounded-xl text-red-700 dark:text-red-400 text-xs font-semibold flex items-center gap-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
                </svg>
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex items-center justify-end gap-x-4 mt-8">
              <Button
                type="reset"
                onClick={close}
                className="h-11 px-6 bg-olive-50 text-olive-600 hover:bg-olive-100 border-olive-200"
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <SubmitButton data-testid="save-button" className="h-11 px-10 min-w-[140px]">Update address</SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default EditAddress
