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
  TooltipProps,
} from "recharts";
import { CardContent } from "../../../@/components/ui/card";
import { ChartConfig } from "../../../@/components/ui/chart";
import { addSpace } from "../../utils/fonctionnel";

export function GraphiqueTdb({
  data,
}: {
  data: {
    month: string;
    montantDepense: number;
    montantRecette: number;
    montantInvest: number;
    year: number;
  }[];
}) {
  const CustomTooltip = (props: TooltipProps<any, any>) => {
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

  // Trouver la valeur maximale parmi les données pour ajuster l'axe Y
  const maxValue = Math.max(
    ...data.map((item) =>
      Math.max(item.montantDepense, item.montantRecette, item.montantInvest),
    ),
  );
  const yAxisDomain = [0, maxValue * 1.1]; // Ajuste le domaine pour éviter le débordement
  const ticks = Array.from(
    { length: 4 },
    (_, i) => Math.ceil((maxValue * 1.1 * i) / 3 / 100) * 100,
  );

  // Configuration des courbes
  const chartConfig: ChartConfig = {
    montantRecette: {
      label: "Recette",
      color: "hsl(var(--graph-recette))",
    },
    montantDepense: {
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
            strokeDasharray="3" // Style de ligne pointillée
            stroke={chartConfig.text.color} // Couleur de la grille
            vertical={false} // Pas de lignes verticales
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
            dataKey="montantRecette"
            type="natural"
            stroke={chartConfig.montantRecette.color} // Utiliser la couleur de chartConfig
            strokeWidth={2}
            dot={{ fill: chartConfig.montantRecette.color, r: 4 }}
            activeDot={{ r: 6 }}
          >
            <LabelList
              fontWeight={100}
              position="top"
              stroke={chartConfig.montantRecette.color}
              offset={10}
              fontSize={12}
              formatter={(value: any) => `${addSpace(value)} €`} // Ajouter € derrière les valeurs
            />
          </Line>

          <Line
            dataKey="montantDepense"
            type="natural"
            stroke={chartConfig.montantDepense.color} // Utiliser la couleur de chartConfig
            strokeWidth={2}
            dot={{ fill: chartConfig.montantDepense.color, r: 4 }}
            activeDot={{ r: 6 }}
          >
            <LabelList
              fontWeight={100}
              stroke={chartConfig.montantDepense.color}
              position="top"
              offset={10}
              fontSize={12}
              formatter={(value: any) => `${addSpace(value)} €`} // Ajouter € derrière les valeurs
            />
          </Line>
          <Line
            dataKey="montantInvest"
            type="natural"
            stroke={chartConfig.montantInvest.color} // Utiliser la couleur de chartConfig
            strokeWidth={2}
            dot={{ fill: chartConfig.montantInvest.color, r: 4 }}
            activeDot={{ r: 6 }}
          >
            <LabelList
              fontWeight={100}
              stroke={chartConfig.montantInvest.color}
              position="top"
              offset={10}
              fontSize={12}
              formatter={(value: any) => `${addSpace(value)} €`} // Ajouter € derrière les valeurs
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
