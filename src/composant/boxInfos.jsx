import { useTheme } from "../context/ThemeContext";
import { addSpace } from "../utils/fonctionnel";

function BoxInfos({ type, title, icon, amount, percent }) {
  let color = "";

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

  return (
    <div
      className={`p-5 w-full h-fit rounded-xl ${bgColor} ring-1 ${color} flex flex-col gap-3`}
    >
      <div className="flex justify-between items-center">
        <p className="font-medium tracking-tight text-sm">{title}</p>
        {icon}
      </div>
      <div className="w-full flex flex-col justify-start items-start">
        <p className="font-bold text-2xl">{amount} €</p>
        <p className="text-muted-foreground text-xs">
          {percent > 0 && "+"}
          {addSpace(percent.toFixed(2))}% depuis le mois dernier
        </p>
      </div>
    </div>
  );
}

export default BoxInfos;
