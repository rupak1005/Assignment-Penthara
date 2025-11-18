import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AccordionItemProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export interface AccordionProps {
  items: AccordionItemProps[]
  className?: string
  allowMultiple?: boolean
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className={cn("border-b border-border", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-medium transition-colors hover:bg-accent/50"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="pb-4 pt-0">{children}</div>
      </div>
    </div>
  )
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  className,
  allowMultiple = false,
}) => {
  const [openItems, setOpenItems] = React.useState<Set<number>>(
    new Set(items.map((_, idx) => (items[idx].defaultOpen ? idx : -1)).filter(i => i !== -1))
  )

  const handleToggle = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        if (!allowMultiple) {
          newSet.clear()
        }
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className={cn("w-full", className)}>
      {items.map((item, index) => (
        <div key={index} className="border-b border-border">
          <button
            type="button"
            onClick={() => handleToggle(index)}
            className="flex w-full items-center justify-between py-4 text-left font-medium transition-colors hover:bg-accent/50"
          >
            <span>{item.title}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                openItems.has(index) && "transform rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              openItems.has(index)
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0"
            )}
          >
            <div className="pb-4 pt-0">{item.children}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export { Accordion, AccordionItem }

