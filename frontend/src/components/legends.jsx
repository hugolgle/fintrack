import { Dot } from "lucide-react";
import "./legends.css";
import { Separator } from "@/components/ui/separator";

export const renderCustomLegend = (props) => {
  const { payload, topN } = props;
  const payloadSort = payload.sort(
    (a, b) => b.payload.pourcentage - a.payload.pourcentage
  );
  const payloadTopN = payloadSort.slice(0, topN);
  console.log(payloadTopN);
  return (
    <ul className="flex flex-col justify-center w-40">
      {payloadTopN.map((entry, index) => (
        <li key={`item-${index}`} className="flex flex-col items-center">
          {index > 0 && <Separator className="bg-secondary" />}
          <div className="flex items-center w-full">
            <Dot strokeWidth={10} color={entry.color} />
            <span className="text-[10px] gap-2 font-thin w-full flex items-center">
              <span className="truncateCustom">{entry.payload.name}</span>
            </span>
            <p className="text-[8px] text-nowrap">
              <span className="text-muted-foreground">
                {entry.payload.objectif && `${entry.payload.objectif}%`}{" "}
              </span>
              <span className="text-[10px] text-nowrap">
                {entry.payload.pourcentage.toFixed(0)}%
              </span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
