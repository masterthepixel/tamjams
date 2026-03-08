"use client"

import { Plus } from "@medusajs/icons"
import { useEffect, useState, useActionState } from "react"
import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress } from "@lib/data/customer"
import { Button } from "@components/oatmeal/elements/button"
import { clsx } from "clsx"

const AddAddress = ({
  region,
  addresses,
}: {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
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

  return (
    <>
      <button
        className="group bg-olive-50 dark:bg-olive-800/20 border border-dashed border-olive-200 dark:border-olive-800 rounded-2xl p-6 min-h-[220px] h-full w-full flex flex-col items-center justify-center gap-y-4 transition-all duration-200 hover:border-olive-400 dark:hover:border-olive-600 hover:bg-olive-100 dark:hover:bg-olive-800/40"
        onClick={open}
        data-testid="add-address-button"
      >
        <div className="bg-white dark:bg-olive-900 size-12 rounded-full flex items-center justify-center border border-olive-100 dark:border-olive-800 shadow-sm transition-transform group-hover:scale-110">
          <Plus className="size-6 text-olive-950 dark:text-white" />
        </div>
        <span className="text-sm font-semibold text-olive-950 dark:text-white uppercase tracking-wider">New Address</span>
      </button>

      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>
          <h2 className="text-2xl font-display text-olive-950 dark:text-white uppercase tracking-widest mb-2">Add Address</h2>
        </Modal.Title>
        <form action={formAction}>
          <Modal.Body>
            <div className="flex flex-col gap-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Company"
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />
              <Input
                label="Address"
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label="Apartment, Suite, etc. (Optional)"
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Postal Code"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Province / State"
                  name="province"
                  autoComplete="address-level1"
                  data-testid="state-input"
                />
                <CountrySelect
                  region={region}
                  name="country_code"
                  required
                  autoComplete="country"
                  data-testid="country-select"
                />
              </div>
              <Input
                label="Phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div
                className="mt-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900/30 p-3 rounded-xl text-red-700 dark:text-red-400 text-xs font-semibold flex items-center gap-x-2"
                data-testid="address-error"
              >
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
              <SubmitButton data-testid="save-button" className="h-11 px-10 min-w-[140px]">Save address</SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress
