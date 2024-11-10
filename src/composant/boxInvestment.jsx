import { useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";
import { addSpace } from "../utils/fonctionnel";

function BoxInvestment({ title, icon, amount, to }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";

  return (
    <div
      className={`p-5 w-full cursor-pointer hover:border-zinc-500 transition-all h-fit rounded-xl ${bgColor} border flex flex-col gap-3`}
      onClick={() => navigate(to)}
    >
      <div className="flex justify-between items-center">
        <p className="font-medium tracking-tight text-sm">{title}</p>
        {icon}
      </div>
      <div className="w-full flex flex-col justify-start items-start">
        <p className="font-bold text-2xl">{amount} €</p>
      </div>
    </div>
  );
}

export default BoxInvestment;
