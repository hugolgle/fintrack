import { Dot } from "lucide-react";
import "./Legend.css";
import { Separator } from "@/components/ui/separator";

export const renderCustomLegend = (props) => {
  const { payload, topN = 5 } = props;
  const payloadSort = payload.sort(
    (a, b) => b.payload.pourcentage - a.payload.pourcentage
  );
  const payloadTopN = payloadSort.slice(0, topN);

  return (
    <ul className="flex flex-col gap-[1px] justify-center w-40">
      {payloadTopN.map((entry, index) => (
        <li
          key={`item-${index}`}
          className="flex flex-col gap-[1px] items-center"
        >
          {index > 0 && <Separator />}
          <div className="flex items-center w-full">
            <Dot strokeWidth={10} color={entry.color} />
            <span className="text-xs gap-1 font-thin w-full flex items-center">
              <span className="truncateCustom">{entry.value}</span>
            </span>
            <span className="text-xs text-nowrap">
              {entry.payload.pourcentage.toFixed(0)}%
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};
