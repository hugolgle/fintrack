import { useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";
import { addSpace } from "../utils/fonctionnel";

function BoxInvestment({ title, icon, value, to }) {
  const navigate = useNavigate();

  return (
    <div
      className="p-5 w-full cursor-pointer hover:border-zinc-500 transition-all h-fit rounded-xl bg-primary-foreground border flex flex-col gap-3"
      onClick={() => navigate(to)}
    >
      <div className="flex justify-between items-center">
        <p className="font-medium tracking-tight text-sm">{title}</p>
        {icon}
      </div>
      <div className="w-full flex flex-col justify-start items-start">
        <p className="font-bold text-2xl">{value}</p>
      </div>
    </div>
  );
}

export default BoxInvestment;
