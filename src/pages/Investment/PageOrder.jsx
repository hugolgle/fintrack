import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { HttpStatusCode } from "axios";
import { format } from "date-fns";
import { fetchInvestments } from "../../Service/Investment.service";
import Header from "../../composant/Header.jsx";
import Loader from "../../composant/Loader/Loader";
import { formatAmount } from "../../utils/fonctionnel";

export function PageOrder() {
  const { isLoading, data, isFetching } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const response = await fetchInvestments();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const orderData = data?.sort((a, b) => {
    const dateA = a.transaction[0]?.date
      ? new Date(a.transaction[0].date)
      : new Date(0);
    const dateB = b.transaction[0]?.date
      ? new Date(b.transaction[0].date)
      : new Date(0);
    return dateB - dateA;
  });

  const getHoverClass = (type) => {
    switch (type) {
      case "Action":
        return "ring-pink-500";
      case "ETF":
        return "ring-blue-500";
      case "Crypto":
        return "ring-green-500";
      case "Obligation":
        return "ring-purple-500";
      case "Dérivé":
        return "ring-red-500";
      default:
        return "ring-gray-500";
    }
  };

  if (isLoading) return <Loader />;

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header
          title="Mes ordres"
          typeProps="investment"
          btnReturn
          isFetching={isFetching}
        />
        <div className="w-full">
          <div className="flex flex-wrap gap-4 justify-center p-4 animate-fade">
            {orderData.length > 0 ? (
              <>
                {data.map(
                  (
                    { _id, name, type, transaction, symbol, amountResult },
                    index
                  ) => {
                    const category = type === "Crypto" ? "crypto" : "symbol";
                    const date = transaction[0]?.date
                      ? new Date(transaction[0].date)
                      : null;

                    return (
                      <Link
                        key={index}
                        to={`/investment/${_id}`}
                        className={`w-72 h-40 flex flex-col gap-4 justify-between font-thin rounded-2xl bg-primary-foreground px-4 py-4 transition-all ring-[2px] hover:scale-95 hover:bg-opacity-80  ${getHoverClass(
                          type
                        )}`}
                      >
                        <div className="flex justify-between">
                          <p className="text-right text-sm text-gray-700 dark:text-gray-300 italic">
                            {date
                              ? format(date, "dd/MM/yyyy")
                              : "Date non disponible"}
                          </p>

                          <Avatar className="w-7 h-7 cursor-pointer hover:scale-95 transition-all">
                            <AvatarImage
                              src={`https://assets.parqet.com/logos/${category}/${symbol}`}
                            />
                            <AvatarFallback className="font-thin text-xs">
                              {name.toUpperCase().substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <p className="text-xl truncate">{name}</p>
                        <div className="flex justify-between">
                          <p className="font-medium italic">
                            {formatAmount(amountResult)} €
                          </p>
                          <p className="text-lg italic">{type}</p>
                        </div>
                      </Link>
                    );
                  }
                )}
              </>
            ) : (
              <p>Aucun investissement trouvé.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
