import * as React from "react"
import { cn } from "@/lib/utils"

export interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, type, label, id, placeholder, value, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(!!value)

    React.useEffect(() => {
      setHasValue(!!value)
    }, [value])

    const inputId = id || `animated-input-${Math.random().toString(36).substr(2, 9)}`
    const shouldFloatLabel = !!label && (focused || hasValue || type === "date")

    return (
      <div className="relative w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none",
              shouldFloatLabel
                ? "top-2 text-xs text-primary font-medium"
                : "top-3 text-sm text-muted-foreground"
            )}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          value={value}
          placeholder={label ? undefined : placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            setHasValue(!!e.target.value)
            props.onChange?.(e)
          }}
          className={cn(
            "flex h-12 w-full rounded-md border border-input bg-background px-3 pt-4 pb-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            label && shouldFloatLabel && "pt-6 pb-2",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
AnimatedInput.displayName = "AnimatedInput"

export { AnimatedInput }

