import * as React from "react"
import { cn } from "@/lib/utils"

export interface NumberFlowProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

const NumberFlow: React.FC<NumberFlowProps> = ({
  value,
  duration = 1000,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = React.useState(0)
  const [isAnimating, setIsAnimating] = React.useState(false)

  React.useEffect(() => {
    setIsAnimating(true)
    const startValue = displayValue
    const endValue = value
    const difference = endValue - startValue
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + difference * easeOut

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  const formattedValue = displayValue.toFixed(decimals)

  return (
    <span className={cn("inline-block", className)}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}

export { NumberFlow }

