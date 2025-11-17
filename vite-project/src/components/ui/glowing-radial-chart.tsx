"use client"

import * as React from "react"
import { RadialBar, RadialBarChart, Cell, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

interface GlowingRadialDatum {
  name: string
  value: number
  fill?: string
}

interface GlowingRadialChartProps {
  data: GlowingRadialDatum[]
  title: string
  subtitle?: string
  trend?: number
  height?: number
}

export function GlowingRadialChart({
  data,
  title,
  subtitle,
  trend = 0,
  height = 260,
}: GlowingRadialChartProps) {
  const [active, setActive] = React.useState<string | null>(null)
  const glowIdBase = React.useId()

  const chartData = React.useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        fill: item.fill ?? `var(--chart-${(index % 5) + 1})`,
        visitors: item.value,
      })),
    [data],
  )

  const config = React.useMemo(() => {
    const base: ChartConfig = {
      visitors: {
        label: title,
      },
    }
    chartData.forEach((item) => {
      base[item.name.toLowerCase()] = {
        label: item.name,
        color: item.fill,
      }
    })
    return base
  }, [chartData, title])

  const trendLabel = `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2 text-center">
          {title}
          <Badge
            variant="outline"
            className="ml-2 flex items-center gap-1 border-none bg-green-500/10 text-green-500"
          >
            <TrendingUp className="h-4 w-4" />
            <span>{trendLabel}</span>
          </Badge>
        </CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square"
          style={{ maxHeight: height }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
            data={chartData}
            innerRadius={30}
            outerRadius={110}
            onMouseMove={(chartState) => {
              const browser = chartState?.activePayload?.[0]?.payload?.name
              if (typeof browser === "string") {
                setActive(browser)
              }
            }}
            onMouseLeave={() => setActive(null)}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" />}
            />
            <RadialBar
              cornerRadius={10}
              dataKey="visitors"
              background
              className="drop-shadow-lg"
            >
              {chartData.map((entry, index) => {
                const glowId = `${glowIdBase}-${index}`
                const isActive = !active || active === entry.name
                return (
                  <Cell
                    key={entry.name}
                    fill={entry.fill}
                    opacity={isActive ? 1 : 0.3}
                    filter={active === entry.name ? `url(#${glowId})` : undefined}
                  />
                )
              })}
            </RadialBar>
            <defs>
              {chartData.map((entry, index) => {
                const glowId = `${glowIdBase}-${index}`
                return (
                  <filter
                    key={`${glowId}-${entry.name}`}
                    id={glowId}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                )
              })}
            </defs>
          </RadialBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
