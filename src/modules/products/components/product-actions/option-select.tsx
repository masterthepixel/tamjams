import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"
import { Radio, RadioGroup } from "@headlessui/react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-semibold text-olive-950 dark:text-white">
        {title}
      </span>
      <RadioGroup
        value={current}
        onChange={(v) => updateOption(option.id, v as string)}
        disabled={disabled}
        className="grid grid-cols-3 gap-3 sm:grid-cols-6"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <Radio
              key={v}
              value={v}
              className={({ checked }) =>
                clx(
                  "flex items-center justify-center rounded-lg border py-3 px-3 text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none transition-all duration-200",
                  {
                    "border-olive-950 bg-olive-950 text-white dark:border-white dark:bg-white dark:text-olive-950 shadow-sm":
                      checked,
                    "border-olive-200 bg-white text-olive-950 hover:bg-olive-50 dark:border-olive-800 dark:bg-olive-900 dark:text-white dark:hover:bg-olive-800":
                      !checked,
                    "opacity-50 cursor-not-allowed": disabled,
                  }
                )
              }
              data-testid="option-button"
            >
              <span>{v}</span>
            </Radio>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export default OptionSelect
