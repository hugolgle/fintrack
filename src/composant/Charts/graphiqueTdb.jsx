"use client";

import {
  CartesianGrid,
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

export function GraphiqueTdb({ data }) {
  const CustomTooltip = (props) => {
    const { active, payload, label } = props;

    if (active && payload && payload.length) {
      const year = data.find((d) => d.month === label)?.year;
      const economieMonth = payload[0].value - payload[1].value;
      return (
        <div className="bg-white dark:bg-black text-xs p-2 rounded-xl shadow-2xl ">
          <div className="text-left mb-1">
            <p style={{ color: "hsl(var(--primary))" }}>
              {label} {year}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-row justify-center items-center gap-1">
                <div className="w-[5px] h-[5px] rounded bg-colorRecette"></div>
                <p className=" opacity-75">Recette</p>
              </div>
              <p className="italic font-black">
                {addSpace(payload[0].value)} €
              </p>
            </div>
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-row justify-center items-center gap-1">
                <div className="w-[5px] h-[5px] rounded bg-colorDepense"></div>
                <p className=" opacity-75">Dépense</p>
              </div>
              <p className="italic font-black">
                {addSpace(payload[1].value)} €
              </p>
            </div>
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
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-row justify-center items-center gap-1">
                <div className="w-[5px] h-[5px] rounded bg-colorInvest"></div>
                <p className=" opacity-75">Investissements</p>
              </div>
              <p className="italic font-black">
                {addSpace(payload[2].value)} €
              </p>
            </div>
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

  const chartConfig = {
    amountRevenue: {
      label: "Recette",
      color: "hsl(var(--graph-recette))",
    },
    amountExpense: {
      label: "Dépense",
      color: "hsl(var(--graph-depense))",
    },
    montantInvest: {
      label: "Investissements",
      color: "hsl(var(--graph-invest))",
    },
    text: {
      color: "hsl(var(--foreground))",
    },
  };

  return (
    <CardContent>
      <ResponsiveContainer width="100%" height={275}>
        <LineChart
          data={data}
          margin={{ top: 20, left: 0, right: 40, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3"
            stroke={chartConfig.text.color}
            e
            vertical={false}
          />

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

          <Line
            dataKey="amountRevenue"
            type="bump"
            stroke={chartConfig.amountRevenue.color}
            strokeWidth={1.5}
            dot={{ fill: chartConfig.amountRevenue.color }}
            activeDot={{ r: 6 }}
          >
            <LabelList
              fontWeight={100}
              position="top"
              stroke={chartConfig.amountRevenue.color}
              offset={10}
              fontSize={12}
              formatter={(value) => `${addSpace(value)} €`}
            />
          </Line>

          <Line
            dataKey="amountExpense"
            type="bump"
            stroke={chartConfig.amountExpense.color}
            strokeWidth={1.5}
            dot={{ fill: chartConfig.amountExpense.color }}
            activeDot={{ r: 6 }}
          >
            <LabelList
              fontWeight={100}
              stroke={chartConfig.amountExpense.color}
              position="top"
              offset={10}
              fontSize={12}
              formatter={(value) => `${addSpace(value)} €`}
            />
          </Line>
          <Line
            dataKey="montantInvest"
            type="bump"
            stroke={chartConfig.montantInvest.color}
            strokeWidth={1.5}
            dot={{ fill: chartConfig.montantInvest.color }}
            activeDot={{ r: 6 }}
          >
            <LabelList
              fontWeight={100}
              stroke={chartConfig.montantInvest.color}
              position="top"
              offset={10}
              fontSize={12}
              formatter={(value) => `${addSpace(value)} €`}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
