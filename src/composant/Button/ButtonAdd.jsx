import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";

function BtnAdd({ to }) {
  return (
    <Link
      className="cursor-pointer hover:scale-110 transition-all"
      to={to ? `${to}/add` : "add"}
    >
      <CirclePlus size={20} />
    </Link>
  );
}

export default BtnAdd;
