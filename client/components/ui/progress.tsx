"use client"

<<<<<<< HEAD
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

=======
import * as ProgressPrimitive from "@radix-ui/react-progress"

import * as React from "react"

>>>>>>> 3b8c465a9b6948542d8d894c61497df1b6d4c8ef
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
<<<<<<< HEAD
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
=======
      "relative h-4 w-full overflow-hidden rounded-base border-2 border-border bg-bw",
      className,
>>>>>>> 3b8c465a9b6948542d8d894c61497df1b6d4c8ef
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
<<<<<<< HEAD
      className="h-full w-full flex-1 bg-primary transition-all"
=======
      className="h-full w-full flex-1 border-r-2 border-border bg-main transition-all"
>>>>>>> 3b8c465a9b6948542d8d894c61497df1b6d4c8ef
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
