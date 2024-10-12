import { ArrowRight } from "lucide-react";
import { retireSpace } from "../../utils/fonctionnel";

function BoxTdb(props) {
  return (
    <>
      <h2 className="text-3xl font-extralight italic">{props.title}</h2>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-row gap-4 h-1/2">
          <div className="flex flex-col w-full h-full bg-green-600 py-3 rounded-lg bg-opacity-15 items-center justify-evenly">
            <p className="font-thin">Recettes</p>
            <p className="font-thin italic text-xl">{props.amountRevenue}</p>
          </div>
          <div className="flex flex-col w-full h-full bg-red-600 py-3 rounded-lg bg-opacity-15 items-center justify-evenly">
            <p className="font-thin">Dépenses</p>
            <p className="font-thin italic text-xl">{props.amountExpense}</p>
          </div>
        </div>
        <div className="flex flex-row gap-4 h-1/2">
          <div className="flex flex-row w-full h-full bg-zinc-600 py-3 rounded-lg bg-opacity-15 items-center justify-evenly">
            <div className="w-full">
              <p className="font-thin">
                {retireSpace(`${props.montantEconomie}`) >= 0
                  ? "Économie"
                  : "Déficit"}
              </p>
              <p className="font-thin italic text-xl">
                {props.montantEconomie} €
              </p>
            </div>
            <ArrowRight className="size-14 text-gray-500" />
            <div className=" w-full">
              <p className="font-thin">Investi</p>
              <p className="font-thin italic text-xl">
                {props.montantInvest} €
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BoxTdb;
