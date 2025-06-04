// C:\Users\Rj\ai-match-connect-nextjs\src\components\ui\progress.tsx
"use client" // Added: Recommend adding if this component value changes on the client

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils" // Assuming cn utility is correctly set up

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary", // Ensure bg-secondary is defined in your Tailwind config
      className
    )}
    {...props}
  >
    {/* Radix sets data-state="indeterminate" when value is null/undefined */}
    <ProgressPrimitive.Indicator
      className="h-full flex-1 bg-primary transition-all" // Ensure bg-primary is defined in your Tailwind config
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }