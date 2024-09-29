import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "../../components/ui/chart";
import { aggregateTransactions } from "../../utils/operations";
import { addSpace } from "../../utils/fonctionnel";

// Custom Tooltip Content Component
const CustomTooltipContent = (props: any) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-black text-xs p-2 rounded-xl shadow-2xl ">
        <div className="text-left mb-1 flex items-center gap-2">
          <div
            className="w-[8px] h-[8px] rounded"
            style={{ backgroundColor: data.fill }}
          ></div>
          <p>{data.name}</p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between gap-4">
            <div className="flex flex-row justify-center items-center gap-1">
              <p className=" opacity-75">Montant</p>
            </div>
            <p className="italic font-black">
              {addSpace(data.value.toFixed(2))} €
            </p>
          </div>
          <div className="flex flex-row justify-between gap-4">
            <div className="flex flex-row justify-center items-center gap-1">
              <p className=" opacity-75">Pourcentage</p>
            </div>
            <p className="italic font-black">{data.pourcentage.toFixed(2)} %</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Legend Component
const renderCustomLegend = (props: any) => {
  const { payload, topN = 5 } = props; // topN from props or default to 5
  // Tri du payload par pourcentage décroissant
  const payloadSort = payload.sort(
    (a: any, b: any) => b.payload.pourcentage - a.payload.pourcentage
  );
  // Tronquer la liste pour n'afficher que les `topN` premiers éléments
  const payloadTopN = payloadSort.slice(0, topN);

  return (
    <ul className="flex flex-col justify-center w-40">
      {payloadTopN.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center my-1">
          <div
            className="w-[10px] h-[10px] rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-xs font-thin italic truncate">
            {entry.value} ({entry.payload.pourcentage.toFixed(2)}%)
          </span>
        </li>
      ))}
    </ul>
  );
};

export function CamembertStat(props: any) {
  // Définir les couleurs de catégorie avec des valeurs hexadécimales
  const categoryColors: { [key: string]: string } = props.categorie.reduce(
    (
      acc: { [key: string]: string },
      category: { name: string; color: string }
    ) => {
      acc[category.name] = category.color;
      return acc;
    },
    {}
  );

  const chartData = aggregateTransactions(props.transactions);
  const totalAmount = chartData.reduce(
    (sum, item) => sum + parseFloat(item.montant),
    0
  );

  const transformedData = chartData.map((item) => ({
    name: item.nomCate,
    value: parseFloat(item.montant),
    pourcentage: (parseFloat(item.montant) / totalAmount) * 100,
    fill: categoryColors[item.nomCate],
  }));

  const chartConfig: ChartConfig = {
    ...Object.keys(categoryColors).reduce(
      (acc, category) => {
        acc[category.toLocaleLowerCase()] = {
          label: category,
          color: categoryColors[category],
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>
    ),
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={180}>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<CustomTooltipContent />} />
            <Pie
              data={transformedData}
              dataKey="value"
              nameKey="name"
              innerRadius={35}
              outerRadius={60}
            >
              {transformedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              content={(props) => renderCustomLegend({ ...props, topN: 5 })}
            />
          </PieChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
