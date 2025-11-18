import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface DynamicIslandProps {
  children: React.ReactNode
  isVisible?: boolean
  onClose?: () => void
  position?: "top" | "bottom"
  className?: string
}

const DynamicIsland: React.FC<DynamicIslandProps> = ({
  children,
  isVisible = true,
  onClose,
  position = "top",
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out",
        position === "top" ? "top-4" : "bottom-4",
        isExpanded ? "w-[90%] max-w-md" : "w-auto",
        className
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={cn(
          "bg-background border border-border rounded-full shadow-lg backdrop-blur-sm",
          "transition-all duration-300",
          isExpanded ? "px-6 py-4" : "px-4 py-2"
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div
            className={cn(
              "transition-all duration-300",
              isExpanded ? "opacity-100 max-w-full" : "opacity-90"
            )}
          >
            {children}
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { DynamicIsland }

