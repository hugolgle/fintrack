import { HandCoins } from "lucide-react";
import Header from "../../composant/Header";
import { WalletCards } from "lucide-react";
import { DollarSign } from "lucide-react";
import { useNavigate } from "react-router";
import BoxInfos from "../../composant/Box/BoxInfos";
import { Landmark } from "lucide-react";

export default function Epargn() {
  const navigate = useNavigate();
  return (
    <section className="w-full">
      <Header title="Épargne" isFetching={false} btnAdd />
      <div className="flex flex-col w-full gap-4 animate-fade">
        <div className="flex gap-4 w-full">
          <BoxInfos
            onClick={() => navigate("/revenue")}
            type="revenue"
            title="Livret A"
            icon={<DollarSign size={15} color="grey" />}
            value={100}
            isAmount
          />

          <BoxInfos
            onClick={() => navigate("/expense")}
            type="depense"
            title="LEP"
            icon={<WalletCards size={15} color="grey" />}
            value={100}
            isAmount
          />
          <BoxInfos
            onClick={() => navigate("/investment")}
            type="Lvret Jeune"
            title="Livret Jeune"
            icon={<HandCoins size={15} color="grey" />}
            value={100}
            isAmount
          />
          <BoxInfos
            type="economy"
            title="Épargne"
            icon={<Landmark size={15} color="grey" />}
            value={100}
            isAmount
          />
        </div>
      </div>
    </section>
  );
}
