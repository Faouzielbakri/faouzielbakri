"use client";

import { Area, AreaChart, CartesianGrid, Cell, Label, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DEVICE_COLORS, OTHER_COLOR, SERIES } from "./palette";

/** The dashboard's two real charts, drawn with shadcn/ui chart on Recharts. */

const trafficConfig = {
  visitors: { label: "Visitors", color: SERIES.orange },
  pageviews: { label: "Page views", color: SERIES.blue },
} satisfies ChartConfig;

export function TrafficChart({ data }: { data: { label: string; visitors: number; pageviews: number }[] }) {
  return (
    <ChartContainer config={trafficConfig} className="aspect-auto h-[215px] w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          {(["visitors", "pageviews"] as const).map((key) => (
            <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.28} />
              <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 5" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} minTickGap={28} />
        <YAxis tickLine={false} axisLine={false} width={34} allowDecimals={false} />
        <ChartTooltip cursor={{ strokeDasharray: "3 4" }} content={<ChartTooltipContent indicator="dot" />} />
        <Area
          dataKey="pageviews"
          type="monotone"
          stroke="var(--color-pageviews)"
          strokeWidth={2}
          fill="url(#fill-pageviews)"
          activeDot={{ r: 4 }}
        />
        <Area
          dataKey="visitors"
          type="monotone"
          stroke="var(--color-visitors)"
          strokeWidth={2}
          fill="url(#fill-visitors)"
          activeDot={{ r: 4 }}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

export function DeviceDonut({ data }: { data: { label: string; visitors: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.visitors, 0);
  const config = Object.fromEntries(
    data.map((d) => [d.label, { label: d.label, color: DEVICE_COLORS[d.label] ?? OTHER_COLOR }]),
  ) satisfies ChartConfig;
  return (
    <ChartContainer config={config} className="aspect-square h-[150px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="label" />} />
        <Pie
          data={data}
          dataKey="visitors"
          nameKey="label"
          innerRadius={46}
          outerRadius={68}
          paddingAngle={data.length > 1 ? 3 : 0}
          cornerRadius={5}
          strokeWidth={0}
        >
          {data.map((d) => (
            <Cell key={d.label} fill={DEVICE_COLORS[d.label] ?? OTHER_COLOR} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox)) return null;
              return (
                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                  <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) - 4} className="fill-ink font-display text-2xl font-bold">
                    {total}
                  </tspan>
                  <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 18} className="fill-muted text-[11px]">
                    visitors
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
