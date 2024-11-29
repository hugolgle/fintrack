import { Dot } from "lucide-react";
import "./Legend.css";

export const renderCustomLegend = (props) => {
  const { payload, topN = 5 } = props;
  const payloadSort = payload.sort(
    (a, b) => b.payload.pourcentage - a.payload.pourcentage
  );
  const payloadTopN = payloadSort.slice(0, topN);

  return (
    <ul className="flex flex-col justify-center w-40">
      {payloadTopN.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center">
          <Dot strokeWidth={6} color={entry.color} />
          <span className="text-xs gap-1 font-thin italic w-full flex items-center">
            <span className="truncateCustom">{entry.value}</span>
            <span className="w-1/4">
              ({entry.payload.pourcentage.toFixed(2)}%)
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};
