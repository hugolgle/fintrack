"use client";

import {
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CardContent } from "@/components/ui/card";
import { addSpace } from "../../utils/fonctionnel";

export function ChartLine({
  data,
  config = {},
  width = "100%",
  height = 225,
  isAnimationActive = true,
}) {
  const defaultConfig = {
    amountRevenue: {
      label: "Recette",
      color: "hsl(var(--graph-recette))",
      visible: true,
    },
    amountExpense: {
      label: "Dépense",
      color: "hsl(var(--graph-depense))",
      visible: true,
    },
    montantInvest: {
      label: "Investissements",
      color: "hsl(var(--graph-invest))",
      visible: true,
    },
    text: {
      color: "hsl(var(--foreground))",
    },
  };

  const chartConfig = { ...defaultConfig, ...config };

  const CustomTooltip = (props) => {
    const { active, payload, label } = props;

    if (active && payload && payload.length) {
      const year = data.find((d) => d.month === label)?.year;
      const economieMonth = payload[0]?.value - payload[1]?.value;
      return (
        <div className="bg-background text-xs p-2 rounded-xl shadow-2xl ">
          <div className="text-left mb-1">
            <p style={{ color: "hsl(var(--primary))" }}>
              {label} {year}
            </p>
          </div>
          <div className="flex flex-col">
            {payload.map((entry, index) => (
              <div key={index} className="flex flex-row justify-between gap-4">
                <div className="flex flex-row justify-center items-center gap-1">
                  <div
                    className={`w-[5px] h-[5px] rounded`}
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <p className=" opacity-75">
                    {chartConfig[entry.dataKey].label}
                  </p>
                </div>
                <p className="italic font-black">{addSpace(entry.value)} €</p>
              </div>
            ))}
            {payload[0] && payload[1] && (
              <div className="flex flex-row justify-between gap-4">
                <div className="flex flex-row justify-center items-center gap-1">
                  <div className="w-[5px] h-[5px]"></div>
                  <p className=" opacity-75">
                    {economieMonth < 0 ? "Déficit" : "Économie"}
                  </p>
                </div>
                <p
                  className={`italic font-black ${economieMonth < 0 ? "text-red-500" : "text-green-500"}`}
                >
                  {economieMonth > 0 ? "+" : ""}
                  {addSpace(economieMonth.toFixed(2))} €
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const maxValue = Math.max(
    ...data.map((item) =>
      Math.max(item.amountExpense, item.amountRevenue, item.montantInvest)
    )
  );
  const yAxisDomain = [0, maxValue * 1.1];
  const ticks = Array.from(
    { length: 4 },
    (_, i) => Math.ceil((maxValue * 1.1 * i) / 3 / 100) * 100
  );

  return (
    <CardContent>
      <ResponsiveContainer width={width} height={height}>
        <LineChart
          data={data}
          margin={{ top: 20, left: 0, right: 40, bottom: 10 }}
        >
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: chartConfig.text.color }}
            tickFormatter={(value) => `${value}`}
            axisLine={{ stroke: chartConfig.text.color, strokeWidth: 1 }}
          />

          <YAxis
            domain={yAxisDomain}
            ticks={ticks}
            tickFormatter={(value) => `${addSpace(value)} €`}
            tick={{ fontSize: 12, fill: chartConfig.text.color }}
            axisLine={{ stroke: chartConfig.text.color, strokeWidth: 1 }}
            tickLine={{ stroke: chartConfig.text.color }}
          />

          <Tooltip content={<CustomTooltip />} />

          {Object.keys(chartConfig).map((key) =>
            chartConfig[key].visible ? (
              <Line
                key={key}
                dataKey={key}
                type="natural"
                stroke={chartConfig[key].color}
                strokeWidth={1.5}
                dot={{ fill: chartConfig[key].color, r: 2 }}
                activeDot={false}
                isAnimationActive={isAnimationActive}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                <LabelList
                  fontWeight={100}
                  position="top"
                  stroke={chartConfig[key].color}
                  offset={10}
                  fontSize={12}
                  formatter={(value) => `${addSpace(value)} €`}
                />
              </Line>
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
