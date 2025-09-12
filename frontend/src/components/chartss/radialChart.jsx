"use client";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Label,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { formatCurrency } from "../../utils/fonctionnel";
import { Dot } from "lucide-react";
import { useAmountVisibility } from "../../context/AmountVisibilityContext";

export function RadialChart({
  chartData,
  chartConfig,
  total,
  legend,
  height = 225,
  fontSizeTotal = 10,
  inner,
  sideLegend = "left",
  outer,
}) {
  const { isVisible } = useAmountVisibility();
  const CustomTooltipContent = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { payload: data } = payload[0];
      return (
        <div className="bg-white dark:bg-black text-[10px] max-w-40 p-2 rounded-md shadow-2xl">
          <div className="text-left mb-1 flex items-center">
            <Dot strokeWidth={5} color={data.fill} />
            <p className="truncate">{data.name}</p>
          </div>
          <div className="flex flex-col">
            {["amount", "pourcentage"].map((key) => {
              const value = data[key];

              if (value !== undefined && value !== null) {
                return (
                  <div
                    key={key}
                    className="flex flex-row justify-between gap-4"
                  >
                    <div className="flex flex-row justify-center items-center gap-1">
                      <p className="opacity-75">
                        {key === "amount"
                          ? "Montant"
                          : key === "pourcentage" && "Pourcentage"}
                      </p>
                    </div>
                    <p className="italic font-black">
                      {key === "amount"
                        ? isVisible
                          ? formatCurrency.format(value)
                          : "••••"
                        : value.toFixed(0)}
                      {key !== "amount" && "%"}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  if (!chartData || chartData.length < 1 || !chartData[0].amount) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-muted-foreground italic">Aucune donnée</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ChartContainer
        config={chartConfig}
        className="aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<CustomTooltipContent />} />
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="category"
            innerRadius={inner}
            outerRadius={outer}
            paddingAngle={4}
            animationDuration={1000}
            cornerRadius={1}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={1} />
            ))}
            {total && (
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-red-100 flex-wrap"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className={`text-[${fontSizeTotal}px] italic font-thin fill-foreground`}
                        >
                          {isVisible ? formatCurrency.format(total) : "••••"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            )}
          </Pie>
          {legend && (
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align={sideLegend}
              content={(props) => legend({ ...props, topN: 4 })}
            />
          )}
        </PieChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
