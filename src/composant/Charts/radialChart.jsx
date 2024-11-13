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
import { addSpace } from "../../utils/fonctionnel";

export function RadialChart({
  chartData,
  chartConfig,
  total,
  legend,
  height,
  inner,
  outer,
}) {
  const CustomTooltipContent = (props) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const { payload: data } = payload[0];
      return (
        <div className="bg-white dark:bg-black text-xs p-2 rounded-xl shadow-2xl">
          <div className="text-left mb-1 flex items-center gap-2">
            <div
              className="w-2 h-2 rounded"
              style={{ backgroundColor: data.fill }}
            ></div>
            <p>{data.name}</p>
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
                        ? addSpace(value.toFixed(2))
                        : value.toFixed(2)}{" "}
                      {key === "amount" ? "€" : "%"}
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
            paddingAngle={2}
            animationDuration={500}
            cornerRadius={4}
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
                          className="text-sm italic font-thin fill-foreground"
                        >
                          {`${addSpace(total)} €`}
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
              align="right"
              content={(props) => legend({ ...props, topN: 5 })}
            />
          )}
        </PieChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
