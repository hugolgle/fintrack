"use client";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Legend,
  Label,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { addSpace } from "../../utils/fonctionnel";

export function CamembertTdb(props) {
  const depensesFixes = parseFloat(props.dataDf);
  const loisir = parseFloat(props.dataLoisir);
  const invest = parseFloat(props.dataInvest);
  let epargne = props.total - (depensesFixes + loisir + invest);

  if (epargne < 0) {
    epargne = 0;
  }

  const total = props.total;

  const chartData = [
    {
      category: "Dépenses fixes",
      objectif: 50,
      amount: depensesFixes,
      pourcentage: (depensesFixes / total) * 100,
      fill: "var(--color-depensesFixes)",
    },
    {
      category: "Loisir",
      objectif: 30,
      amount: loisir,
      pourcentage: (loisir / total) * 100,
      fill: "var(--color-loisir)",
    },
    {
      category: "Investissements",
      objectif: 10,
      amount: invest,
      pourcentage: (invest / total) * 100,
      fill: "var(--color-invest)",
    },
    {
      category: "Épargne",
      objectif: 10,
      amount: epargne,
      pourcentage: (epargne / total) * 100,
      fill: "var(--color-epargne)",
    },
  ];

  const chartConfig = {
    depensesFixes: {
      label: "Dépenses fixes",
      color: "hsl(var(--graph-depensesFixes))",
    },
    loisir: {
      label: "Loisir",
      color: "hsl(var(--graph-loisir))",
    },
    invest: {
      label: "Investissements",
      color: "hsl(var(--graph-invest))",
    },
    epargne: {
      label: "Épargne",
      color: "hsl(var(--graph-epargn))",
    },
  };

  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex items-center justify-around gap-4 mt-4 w-full">
        {payload?.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-[10px] h-[10px] rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-xs italic">
              {entry.value} ({entry.payload.pourcentage.toFixed(2)}%)
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const CustomTooltipContent = (props) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const { name, value, payload: data } = payload[0];
      const pourcentage = data.pourcentage.toFixed(2) || 0;
      const objectif = data.objectif.toFixed(2) || 0;

      return (
        <div className="bg-white dark:bg-zinc-900 text-xs p-2 rounded-xl shadow-2xl">
          <div className="text-left mb-1 flex items-center gap-2">
            <div
              className="w-2 h-2 rounded"
              style={{ backgroundColor: data.fill }}
            ></div>
            <p>{name}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-row justify-center items-center gap-1">
                <p className="opacity-75">Montant</p>
              </div>
              <p className="italic font-black">
                {addSpace(value.toFixed(2))} €
              </p>
            </div>
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-row justify-center items-center gap-1">
                <p className="opacity-75">Pourcentage</p>
              </div>
              <p className="italic font-black">{pourcentage ?? "0"} %</p>
            </div>
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-row justify-center items-center gap-1">
                <p className="opacity-75">Objectif</p>
              </div>
              <p className="italic font-black">{objectif} %</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={240}>
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
            innerRadius={50}
            outerRadius={80}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                strokeWidth={1}
                stroke="white"
              />
            ))}
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
                        className="text-xs italic font-thin fill-foreground"
                      >
                        {`${addSpace(total)} €`}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
          <Legend content={renderCustomLegend} />
        </PieChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
