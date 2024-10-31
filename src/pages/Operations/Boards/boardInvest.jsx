import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchInvestments } from "../../../service/investment.service";
import {
  calculTotalInvestment,
  calculTotalInvestmentByTitle,
} from "../../../utils/calcul";
import { formatDateSlash } from "../../../utils/fonctionnel";
import Header from "../../../composant/header";
import { toast } from "sonner";
import Loader from "../../../composant/loader/loader";

export default function BoardInvest() {
  const { isLoading, data, isFetching } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const response = await fetchInvestments();

      if (response?.response?.data?.message) {
        const message = response.response.data.message;
        toast.warn(message);
      }

      return response.data;
    },
    refetchOnMount: true,
  });

  const firstDateByTitle = Array.isArray(data)
    ? data?.reduce((acc, investment) => {
        const { title, date } = investment;
        if (!acc[title] || new Date(date) < new Date(acc[title])) {
          acc[title] = date;
        }
        return acc;
      }, {})
    : {};

  const uniqueInvest = Array.isArray(data)
    ? data?.filter((investment) => {
        return (
          new Date(investment.date).getTime() ===
          new Date(firstDateByTitle[investment.title]).getTime()
        );
      })
    : [];

  const investmentCountByTitle = Array.isArray(data)
    ? data?.reduce((acc, investment) => {
        const { title } = investment;
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {})
    : {};

  const montantInvestInProgress = calculTotalInvestment(data, false, "");
  const montantInvestSold = calculTotalInvestment(data, true, "");
  const montantInvest = calculTotalInvestment(data, null, "");

  const getHoverClass = (type) => {
    switch (type) {
      case "Action":
        return "bg-pink-600";
      case "ETF":
        return "bg-blue-600";
      case "Crypto":
        return "bg-green-600";
      case "Obligation":
        return "bg-purple-600";
      case "Dérivé":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  if (isLoading) return <Loader />;

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header
          title="Board investissement"
          typeProps="investment"
          btnAdd
          isFetching={isFetching}
        />
        <div className="flex flex-col w-full justify-center gap-4 animate-fade">
          <div className="h-32 flex gap-4">
            <Link
              to="inprogress"
              className="w-full relative flex flex-col items-center justify-center h-full bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl hover:bg-opacity-80 hover:scale-95 transition-all p-2"
            >
              <p className="italic font-thin absolute top-2">
                Investissements en cours
              </p>
              <p className="text-3xl font-thin">{montantInvestInProgress}</p>
            </Link>
            <Link
              to="all"
              className="w-full relative flex flex-col items-center justify-center h-full bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl hover:bg-opacity-80 hover:scale-95 transition-all p-2"
            >
              <p className="italic font-thin absolute top-2">
                Tous les investissements
              </p>
              <p className="text-3xl font-thin">{montantInvest}</p>
            </Link>
            <Link
              to="sold"
              className="w-full relative flex flex-col items-center justify-center h-full bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl hover:bg-opacity-80 hover:scale-95 transition-all p-2"
            >
              <p className="italic font-thin absolute top-2">
                Investissements vendus
              </p>
              <p className="text-3xl font-thin">{montantInvestSold}</p>
            </Link>
          </div>

          <div className="flex items-center justify-center mb-1 px-8">
            <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>{" "}
            <p className="text-xl mx-8 font-thin italic">Mes ordres</p>
            <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>{" "}
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-4">
            {uniqueInvest.length > 0 ? (
              uniqueInvest.map(({ title, type, date }, index) => {
                const linkInvest = title.toLowerCase().replace(/\s+/g, "");
                const amount = calculTotalInvestmentByTitle(data, null, title);
                const count = investmentCountByTitle[title];
                return (
                  <Link
                    key={index}
                    to={linkInvest}
                    className={`w-60 h-40 flex flex-col gap-4 justify-between font-thin rounded-2xl px-4 py-4 transition-all hover:scale-95 bg-opacity-20 hover:bg-opacity-50 ${getHoverClass(
                      type
                    )} `}
                  >
                    <div className="flex justify-between">
                      <p className="text-right text-sm text-gray-700 dark:text-gray-300 italic">
                        {formatDateSlash(date)}
                      </p>
                      <p className="text-right text-sm text-gray-700 dark:text-gray-300 italic">
                        {type}
                      </p>
                    </div>

                    <p className="text-xl truncate">{title}</p>
                    <div className="flex justify-between">
                      <p className="font-medium italic">{amount}</p>
                      <p className="text-lg italic">({count})</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p>Aucun investissement trouvé.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
