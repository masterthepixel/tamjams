import { clsx } from "clsx"

const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <div className={clsx(
      "px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 whitespace-nowrap",
      className
    )}>
      <span>Attention:</span> For testing purposes only.
    </div>
  )
}

export default PaymentTest
