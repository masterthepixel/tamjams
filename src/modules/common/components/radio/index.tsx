import { clsx } from "clsx"

const Radio = ({ checked, 'data-testid': dataTestId }: { checked: boolean, 'data-testid'?: string }) => {
  return (
    <div
      role="radio"
      aria-checked={checked}
      className="flex h-5 w-5 items-center justify-center outline-none"
      data-testid={dataTestId || 'radio-button'}
    >
      <div
        className={clsx(
          "size-4 rounded-full border flex items-center justify-center transition-all duration-200",
          checked
            ? "border-olive-950 dark:border-white bg-olive-950 dark:bg-white"
            : "border-olive-300 dark:border-olive-700 bg-transparent"
        )}
      >
        {checked && (
          <div className="size-1.5 rounded-full bg-white dark:bg-olive-950" />
        )}
      </div>
    </div>
  )
}

export default Radio
