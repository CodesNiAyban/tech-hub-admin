import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
        destructive:
          "border-transparent bg-red-500 text-zinc-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/80",
        outline: "text-zinc-950 dark:text-zinc-50",
        success: "border-transparent bg-sky-700 text-slate-50 hover:bg-emerald-700/80 dark:bg-sky-700 dark:text-zinc-50 dark:hover:bg-sky-700/70",
        muted: "border-transparent bg-gray-300 text-zinc-900 hover:bg-gray-300/80 dark:bg-muted-300 dark:text-zinc-600 dark:hover:bg-gray-800/80",
        yellow: "border-transparent bg-yellow-500 text-zinc-50 hover:bg-yellow-500/80 dark:bg-yellow-500 dark:text-zinc-50 dark:hover:bg-yellow-900/80",
        free: "border-transparent bg-green-500 text-zinc-50 hover:bg-green-500/80 dark:bg-green-500 dark:text-zinc-50 dark:hover:bg-green-700/80",
        basic: "border-transparent bg-blue-500 text-zinc-50 hover:bg-blue-500/80 dark:bg-blue-500 dark:text-zinc-50 dark:hover:bg-blue-700/80",
        pro: "border-transparent bg-purple-500 text-zinc-50 hover:bg-purple-500/80 dark:bg-purple-500 dark:text-zinc-50 dark:hover:bg-purple-700/80",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
