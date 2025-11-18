import * as React from "react"
import { cn } from "@/lib/utils"

export interface AnimatedProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  label?: string
  color?: string
}

const AnimatedProgressBar = React.forwardRef<
  HTMLDivElement,
  AnimatedProgressBarProps
>(({ value, max = 100, className, showLabel = true, label, color }, ref) => {
  const [displayValue, setDisplayValue] = React.useState(0)
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(percentage)
    }, 100)

    return () => clearTimeout(timer)
  }, [percentage])

  const progressColor = color || "bg-primary"

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {showLabel && (label || value !== undefined) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            {label || "Progress"}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(displayValue)}%
          </span>
        </div>
      )}
      <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            !color?.includes("gradient") && progressColor
          )}
          style={{ 
            width: `${displayValue}%`,
            ...(color?.includes("gradient") ? { background: color.replace("bg-gradient-to-r", "linear-gradient(to right") } : {})
          }}
        />
      </div>
    </div>
  )
})
AnimatedProgressBar.displayName = "AnimatedProgressBar"

export { AnimatedProgressBar }

