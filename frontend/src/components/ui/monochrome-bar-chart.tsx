"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import React from "react";
import type { SVGProps } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MonochromeBarChartProps {
  data: Array<{ [key: string]: string | number }>;
  dataKey: string;
  nameKey: string;
  title?: string;
  description?: string;
  height?: number;
  color?: string;
}

/**
 * Monochrome bar chart component from EvilCharts
 * @param {MonochromeBarChartProps} props - Component props
 */
export function MonochromeBarChart({
  data,
  dataKey,
  nameKey,
  title,
  description,
  height = 300,
  color = "var(--secondary-foreground)",
}: MonochromeBarChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);

  const activeData = React.useMemo(() => {
    if (activeIndex === undefined) return null;
    return data[activeIndex];
  }, [activeIndex, data]);

  // Calculate trend (simple comparison between first and last)
  const trend =
    data.length > 1 && Number(data[0][dataKey]) !== 0
      ? ((Number(data[data.length - 1][dataKey]) - Number(data[0][dataKey])) /
          Number(data[0][dataKey])) *
        100
      : 0;

  const chartConfig = {
    [dataKey]: {
      label: title || dataKey,
      color,
    },
  } satisfies ChartConfig;

  const activeValue = activeData ? Number(activeData[dataKey]) : null;
  const displayValue = activeValue !== null ? activeValue : (data.length > 0 ? Number(data[data.length - 1][dataKey]) : 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className={cn("text-2xl tracking-tighter font-mono")}>
            {displayValue}
          </span>
          <Badge variant="secondary">
            <TrendingUp className="h-4 w-4" />
            <span>{trend.toFixed(1)}%</span>
          </Badge>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <ChartContainer
            config={chartConfig}
            className={cn("w-full")}
            style={{ height }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={data}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                <XAxis
                  dataKey={nameKey}
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => String(value).slice(0, 3)}
                />
                <Bar
                  dataKey={dataKey}
                  fill={color}
                  shape={
                    <CustomBar
                      setActiveIndex={setActiveIndex}
                      activeIndex={activeIndex}
                    />
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

interface CustomBarProps extends SVGProps<SVGSVGElement> {
  setActiveIndex: (index?: number) => void;
  index?: number;
  activeIndex?: number;
  value?: string | number;
}

const CustomBar = (props: CustomBarProps) => {
  const { fill, x, y, width, height, index, activeIndex, value } = props;

  // Custom variables
  const xPos = Number(x || 0);
  const realWidth = Number(width || 0);
  const isActive = index === activeIndex;
  const collapsedWidth = 2;
  // centered bar x-position
  const barX = isActive ? xPos : xPos + (realWidth - collapsedWidth) / 2;
  // centered text x-position
  const textX = xPos + realWidth / 2;
  // Custom bar shape
  return (
    <g onMouseEnter={() => props.setActiveIndex(index)}>
      {/* rendering the bar with custom position and animated width */}
      <motion.rect
        style={{
          willChange: "transform, width", // helps with performance
        }}
        y={y}
        initial={{ width: collapsedWidth, x: barX }}
        animate={{ width: isActive ? realWidth : collapsedWidth, x: barX }}
        transition={{
          duration: activeIndex === index ? 0.5 : 1,
          type: "spring",
        }}
        height={height}
        fill={fill}
      />
      {/* Render value text on top of bar */}
      {isActive && (
        <motion.text
          style={{
            willChange: "transform, opacity", // helps with performance
          }}
          className="font-mono"
          key={index}
          initial={{ opacity: 0, y: -10, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
          transition={{ duration: 0.1 }}
          x={textX}
          y={Number(y) - 5}
          textAnchor="middle"
          fill={fill}
        >
          {value}
        </motion.text>
      )}
    </g>
  );
};
