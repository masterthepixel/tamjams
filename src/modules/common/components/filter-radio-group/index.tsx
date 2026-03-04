import { clsx } from "clsx"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <span className="text-sm font-semibold text-olive-950 dark:text-white uppercase tracking-wider">
        {title}
      </span>
      <div className="flex flex-col gap-y-2" data-testid={dataTestId}>
        {items?.map((i) => (
          <button
            key={i.value}
            onClick={() => handleChange(i.value)}
            className={clsx(
              "flex items-center gap-x-2 text-sm transition-colors duration-200 text-left",
              i.value === value
                ? "text-olive-950 dark:text-white font-medium"
                : "text-olive-600 dark:text-olive-400 hover:text-olive-800 dark:hover:text-olive-200"
            )}
            data-testid="radio-label"
            data-active={i.value === value}
          >
            <div
              className={clsx(
                "size-4 rounded-full border flex items-center justify-center transition-all duration-200",
                i.value === value
                  ? "border-olive-950 dark:border-white bg-olive-950 dark:bg-white"
                  : "border-olive-300 dark:border-olive-700"
              )}
            >
              {i.value === value && (
                <div className="size-1.5 rounded-full bg-white dark:bg-olive-950" />
              )}
            </div>
            {i.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterRadioGroup
