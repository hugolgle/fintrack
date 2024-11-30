import { ArrowLeftRight } from "lucide-react";
import { Link } from "react-router-dom";

function BtnAddTransfer() {
  return (
    <Link
      className="cursor-pointer hover:scale-110 transition-all"
      to="/epargn/transfer"
    >
      <ArrowLeftRight size={20} />
    </Link>
  );
}

export default BtnAddTransfer;
