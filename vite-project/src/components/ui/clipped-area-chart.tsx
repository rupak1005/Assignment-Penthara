"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts"
import { useMotionValueEvent, useSpring } from "motion/react"
import { TrendingDown, TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer } from "@/components/ui/chart"

interface ClippedAreaChartProps {
  data: Array<Record<string, number | string>>
  dataKey: string
  nameKey: string
  title: string
  description?: string
  height?: number
  color?: string
  trend?: number
}

/**
 * Animated clipped area chart inspired by EvilCharts
 */
export function ClippedAreaChart({
  data,
  dataKey,
  nameKey,
  title,
  description,
  height = 260,
  color = "var(--chart-1)",
  trend,
}: ClippedAreaChartProps) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const [axis, setAxis] = React.useState(0)

  const springX = useSpring(0, {
    damping: 30,
    stiffness: 100,
  })
  const springY = useSpring(0, {
    damping: 30,
    stiffness: 100,
  })

  React.useEffect(() => {
    const width = chartRef.current?.getBoundingClientRect().width ?? 0
    springX.set(width)
    setAxis(width)
    const lastValue = data.length
      ? Number(data[data.length - 1][dataKey]) || 0
      : 0
    springY.set(lastValue)
  }, [data, dataKey, springX, springY])

  useMotionValueEvent(springX, "change", (latest) => {
    setAxis(latest)
  })

  const gradientId = React.useId()

  const formattedValue = Number(springY.get() || 0).toFixed(0)
  const trendValue = trend ?? 0
  const TrendIcon = trendValue >= 0 ? TrendingUp : TrendingDown
  const trendLabel = `${trendValue >= 0 ? "+" : ""}${trendValue.toFixed(1)}%`

  const config = {
    [dataKey]: {
      label: title,
      color,
    },
  }

  const lastValue = data.length
    ? Number(data[data.length - 1][dataKey]) || 0
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          {formattedValue}
          <Badge
            variant="secondary"
            className="ml-2 flex items-center gap-1"
          >
            <TrendIcon className="h-4 w-4" />
            <span>{trendLabel}</span>
          </Badge>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          ref={chartRef}
          className="w-full"
          style={{ height }}
          config={config}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
            data={data}
            onMouseMove={(state) => {
              const x = state?.activeCoordinate?.x
              const value = state?.activePayload?.[0]?.value
              if (typeof x === "number" && typeof value === "number") {
                springX.set(x)
                springY.set(value)
              }
            }}
            onMouseLeave={() => {
              const width = chartRef.current?.getBoundingClientRect().width ?? 0
              springX.set(width)
              springY.set(lastValue)
            }}
            margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              horizontalCoordinatesGenerator={(props) => {
                const { height: chartHeight } = props
                return [0, chartHeight - 30]
              }}
            />
            <XAxis
              dataKey={nameKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => String(value).slice(0, 3)}
            />
            <Area
              dataKey={dataKey}
              type="monotone"
              fill={`url(#${gradientId})`}
              fillOpacity={0.4}
              stroke={color}
              clipPath={`inset(0 ${Math.max((chartRef.current?.getBoundingClientRect().width ?? axis) - axis, 0)}px 0 0)`}
            />
            <line
              x1={axis}
              y1={0}
              x2={axis}
              y2="85%"
              stroke={color}
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeOpacity={0.2}
            />
            <rect
              x={axis - 50}
              y={0}
              width={50}
              height={18}
              fill={color}
            />
            <text
              x={axis - 25}
              y={13}
              fontWeight={600}
              textAnchor="middle"
              fill="var(--primary-foreground)"
            >
              {formattedValue}
            </text>
            <Area
              dataKey={dataKey}
              type="monotone"
              fill="none"
              stroke={color}
              strokeOpacity={0.1}
            />
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
