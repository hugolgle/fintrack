import { TrendingDown } from "lucide-react";
import { formatCurrency } from "../../utils/fonctionnel";
import { TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useEffect } from "react";
import Container from "../Container/Container";

function BoxInfos({
  type,
  title,
  icon,
  value,
  valueLast,
  onClick,
  yearLast,
  isAmount,
  plafond,
  description,
  isPercent,
}) {
  const [progress, setProgress] = useState(0);

  let color = "ring-zinc-500";

  switch (type) {
    case "depense":
      color = "ring-colorExpense/65 hover:ring-colorExpense";
      break;
    case "revenue":
      color = "ring-colorRevenue/65 hover:ring-colorRevenue";
      break;

    case "investment":
      color = "ring-colorInvest/65 hover:ring-colorInvest";
      break;
  }

  const diffAmount =
    value < 0 && valueLast < 0 ? valueLast - value : value - valueLast;

  useEffect(() => {
    const timer = setTimeout(() => setProgress((value * 100) / plafond), 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div onClick={onClick} className="w-full">
      <Container
        custom={`ring-opacity-65 ${onClick && "hover:ring-opacity-100 cursor-pointer"} h-full ring-1 ${color} flex flex-col gap-3`}
      >
        <div className="flex justify-between items-center">
          <p className="font-medium tracking-tight text-sm">{title}</p>
          {icon}
        </div>
        <div className="w-full flex flex-col h-full justify-end items-start">
          <p className="font-bold flex italic items-end gap-2 text-lg">
            {isAmount
              ? formatCurrency.format(value)
              : isPercent
                ? `${value} %`
                : value}
            {valueLast && diffAmount < 0 ? (
              <TrendingDown size={15} color="red" />
            ) : diffAmount > 0 ? (
              <TrendingUp size={15} color="green" />
            ) : null}
          </p>

          {valueLast && (
            <p className="text-muted-foreground text-xs">
              {diffAmount > 0 && "+"}
              {formatCurrency.format(diffAmount)} par rapport
              {yearLast ? ` à ${yearLast}` : " au mois dernier"}
            </p>
          )}
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
          {plafond && (
            <div className="relative flex gap-2 items-center w-full">
              <Progress
                value={progress > 100 ? 100 : progress}
                className="w-full h-1"
              />
              <p className="text-muted-foreground italic text-[10px] text-nowrap">
                {progress.toFixed(2)} %
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default BoxInfos;
