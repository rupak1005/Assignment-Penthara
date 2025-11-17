"use client"

import * as React from "react"
import {
  Tooltip as RechartsTooltip,
  type TooltipProps,
} from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  {
    label?: string
    color?: string
    icon?: React.ComponentType
  }
>

const ChartContext = React.createContext<ChartConfig | null>(null)

function useChartConfig() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("Chart components must be used inside <ChartContainer />")
  }
  return context
}

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps
>(({ config, className, children, ...props }, ref) => {
  return (
    <ChartContext.Provider value={config}>
      <div
        ref={ref}
        className={cn(
          "relative flex w-full items-center justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-polar-angle-axis-tick_text]:fill-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

export type ChartTooltipProps = React.ComponentProps<typeof RechartsTooltip>

export function ChartTooltip(props: ChartTooltipProps) {
  return <RechartsTooltip {...props} />
}

interface ChartTooltipContentProps
  extends TooltipProps<ValueType, NameType> {
  hideLabel?: boolean
  nameKey?: string
  valueFormatter?: (value: ValueType) => React.ReactNode
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
  nameKey,
  valueFormatter,
}: ChartTooltipContentProps) {
  const config = useChartConfig()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="grid gap-1 rounded-md border bg-card px-3 py-2 text-xs shadow-md">
      {!hideLabel && label ? (
        <div className="font-medium text-foreground">{label}</div>
      ) : null}
      {payload.map((item) => {
        const key = String(item.dataKey)
        const color =
          item.color ?? config[key]?.color ?? "hsl(var(--foreground))"
        const resolvedName =
          (nameKey &&
            item.payload &&
            (item.payload[nameKey as keyof typeof item.payload] as
              | string
              | number)) ??
          config[key]?.label ??
          item.name ??
          key
        const rawValue = item.value
        const displayValue =
          rawValue === undefined
            ? "–"
            : valueFormatter
              ? valueFormatter(rawValue)
              : rawValue
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground">{resolvedName}</span>
            <span className="ml-auto font-medium text-foreground">
              {displayValue}
            </span>
          </div>
        )
      })}
    </div>
  )
}
