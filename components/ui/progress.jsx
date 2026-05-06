"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

function Progress({ className, value, ...props }) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 transition-all bg-primary"
        style={{ 
          // Using width instead of translate for better reliability
          width: `${value || 0}%`,
          // Ensure a fallback color is visible if the primary variable fails
          backgroundColor: 'var(--primary, #3b82f6)' 
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }