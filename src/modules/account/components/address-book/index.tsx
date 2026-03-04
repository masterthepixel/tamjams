import React from "react"
import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"
import { HttpTypes } from "@medusajs/types"

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer
  region: HttpTypes.StoreRegion
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  const { addresses } = customer
  return (
    <div className="w-full flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-4xl font-display text-olive-950 dark:text-white uppercase tracking-wider">
          Shipping Addresses
        </h1>
        <p className="text-sm text-olive-600 dark:text-olive-400">
          Manage your saved addresses for a faster checkout experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddAddress region={region} addresses={addresses} />
        {addresses.map((address) => {
          return (
            <EditAddress region={region} address={address} key={address.id} />
          )
        })}
      </div>
    </div>
  )
}

export default AddressBook
