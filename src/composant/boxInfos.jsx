import { useTheme } from "../context/ThemeContext";
import { addSpace, formatAmountWithoutSpace } from "../utils/fonctionnel";

function BoxInfos({
  type,
  title,
  icon,
  value,
  valueLast,
  onClick,
  year,
  isAmount,
}) {
  let color = "ring-zinc-500";

  switch (type) {
    case "depense":
      color = "ring-colorExpense";
      break;
    case "revenue":
      color = "ring-colorRevenue";
      break;
    case "epargn":
      color = "ring-colorEpargn";
      break;
    case "investment":
      color = "ring-colorInvest";
      break;
  }

  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";

  const percent =
    ((formatAmountWithoutSpace(value, true) -
      formatAmountWithoutSpace(valueLast, true)) /
      formatAmountWithoutSpace(valueLast, true)) *
    100;

  return (
    <div
      onClick={onClick}
      className={`p-5 w-full h-auto rounded-xl ${bgColor} hover:bg-transparent dark:hover:bg-transparent transition-all cursor-pointer ring-1 ${color} flex flex-col gap-3`}
    >
      <div className="flex justify-between items-center">
        <p className="font-medium tracking-tight text-sm">{title}</p>
        {icon}
      </div>
      <div className="w-full flex flex-col h-full justify-end items-start">
        <p className="font-bold italic text-2xl">
          {addSpace(value)} {isAmount && "€"}
        </p>

        {valueLast && (
          <p className="text-muted-foreground text-xs">
            {percent > 0 && "+"}
            {percent.toFixed(2)}% par rapport{" "}
            {year ? "à l'année dernière" : "au mois dernier"}
          </p>
        )}
      </div>
    </div>
  );
}

export default BoxInfos;
