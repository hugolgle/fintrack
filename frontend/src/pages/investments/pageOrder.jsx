import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { HttpStatusCode } from "axios";
import { format } from "date-fns";
import { fetchInvestments } from "../../services/investment.service.jsx";
import Header from "../../components/headers.jsx";
import Loader from "../../components/loaders/loader.jsx";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Tableau from "../../components/tables/table.jsx";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Eye } from "lucide-react";
import { ROUTES } from "../../components/route.jsx";
import SkeletonDashboard from "../../components/skeletonBoard.jsx";
import { useAmountVisibility } from "../../context/AmountVisibilityContext.jsx";

export function PageOrder() {
  const { isVisible } = useAmountVisibility();
  const {
    isLoading,
    data: dataInvestments,
    isFetching,
  } = useQuery({
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

  const [mode, setMode] = useState(false);

  const handleSwitchMode = (checked) => {
    setMode(checked);
  };

  const orderData = dataInvestments?.sort((a, b) => {
    const dateA =
      a.cycles
        ?.flatMap((c) => c.transaction || [])
        .sort((x, y) => new Date(y.date) - new Date(x.date))[0]?.date || 0;
    const dateB =
      b.cycles
        ?.flatMap((c) => c.transaction || [])
        .sort((x, y) => new Date(y.date) - new Date(x.date))[0]?.date || 0;
    return new Date(dateB) - new Date(dateA);
  });

  const navigate = useNavigate();

  const getHoverClass = (type) => {
    switch (type) {
      case "Action":
        return "ring-pink-500 ";
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

  if (isLoading) return <SkeletonDashboard />;

  const formatData = (row) => {
    return [
      row.name,
      isVisible ? formatCurrency.format(row.amountBuyInProgress) : "••••",
      isVisible ? formatCurrency.format(row.amountBuy) : "••••",
      isVisible ? formatCurrency.format(row.amountSale) : "••••",
      isVisible ? formatCurrency.format(row.amountResult) : "••••",
      isVisible ? `${row.rendement.toFixed(1)} %` : "••••",
      isVisible ? formatCurrency.format(row.dividend) : "••••",
    ];
  };

  const avatar = (item) => {
    const category = item.type === "Crypto" ? "crypto" : "symbol";
    return (
      <Avatar key="avatar" className="size-6">
        <AvatarImage
          src={
            item.isin
              ? `https://assets.parqet.com/logos/isin/${item.isin}`
              : `https://assets.parqet.com/logos/${category}/${item.symbol}`
          }
        />
      </Avatar>
    );
  };

  const columns = [
    { id: 2, name: "Nom", key: "name" },
    { id: 3, name: "En cours", key: "amountBuyInProgress" },
    { id: 4, name: "Montant acheté", key: "amountBuy" },
    { id: 5, name: "Montant vendu", key: "amountSale" },
    { id: 6, name: "Résultats", key: "amountResult" },
    { id: 7, name: "Rendement", key: "rendement" },
    { id: 8, name: "Dividende", key: "dividend" },
  ];

  const action = (item) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          <DropdownMenuItem
            onClick={() => {
              navigate(ROUTES.INVESTMENT_BY_ID.replace(":id", item.idInvest));
            }}
            onSelect={(e) => e.preventDefault()}
          >
            <Eye className="mr-2 h-4 w-4" />
            Voir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const displayData = dataInvestments?.map(
    ({ _id, name, type, symbol, isin, cycles, dividend, createdAt }) => {
      const allTransactions = cycles.flatMap(
        (cycle) => cycle.transactions || []
      );

      const amountBuyInProgress = cycles
        .filter((c) => !c.closed)
        .reduce((sum, c) => sum + (c.amountBuy || 0), 0);

      const amountBuy = cycles
        .filter((c) => c.closed)
        .reduce((sum, c) => sum + (c.amountBuy || 0), 0);

      const amountSale = cycles.reduce(
        (sum, c) => sum + (c.amountSale || 0),
        0
      );
      const amountResult = cycles.reduce((sum, c) => sum + (c.result || 0), 0);

      const amountDividend = dividend?.reduce(
        (sum, d) => sum + (d.amount || 0),
        0
      );

      const active = cycles.some((cycle) => !cycle.closed);

      return {
        _id: _id,
        idInvest: _id,
        type,
        symbol,
        isin,
        name,
        cycles,
        date: allTransactions[0]?.date
          ? new Date(allTransactions[0].date)
          : null,
        amountBuyInProgress,
        amountBuy,
        amountSale,
        amountResult,
        rendement: (amountResult / Math.abs(amountBuy)) * 100 || 0,
        transaction: allTransactions,
        dividend: amountDividend,
        active: active ? "Non clos" : "Clos",
        createdAt,
      };
    }
  );

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header
          title="Mon Portefeuille"
          btnReturn
          isFetching={isFetching}
          navigation={
            <div className="flex items-center gap-2">
              <Label htmlFor="new" className="text-xs italic">
                Vue tuile
              </Label>
              <Switch
                id="new"
                checked={mode}
                onCheckedChange={handleSwitchMode}
                size={3}
              />
            </div>
          }
        />
        <div>
          {orderData?.length > 0 ? (
            <>
              {!mode ? (
                <Tableau
                  formatData={formatData}
                  data={displayData}
                  columns={columns}
                  type="investments"
                  isFetching={isFetching}
                  action={action}
                  firstItem={avatar}
                  fieldsFilter={[
                    { key: "type", fieldName: "Type" },
                    { key: "active", fieldName: "Statut" },
                  ]}
                  dateFilter
                  resume={false}
                />
              ) : (
                <div className="flex flex-wrap w-full justify-center gap-4 justify-left p-4 animate-fade">
                  {displayData?.map(
                    ({ idInvest, name, type, date, symbol, isin, amountBuyInProgress }) => {
                      const category = type === "Crypto" ? "crypto" : "symbol";
                      const theDate = date ? new Date(date) : null;
                      const color = getHoverClass(type);

                      return (
                        <Link
                          key={idInvest}
                          to={ROUTES.INVESTMENT_BY_ID.replace(":id", idInvest)}
                          className={`w-52 h-32 flex animate-fade flex-col justify-between font-thin rounded-md p-4 transition-all ring-[1px] hover:ring-opacity-75 hover:scale-105 ${color}`}
                        >
                          <div className="flex justify-between">
                            <p className="text-right text-xs text-gray-700 dark:text-gray-300 italic">
                              {date
                                ? format(theDate, "dd/MM/yyyy")
                                : "Date non disponible"}
                            </p>

                            <Avatar className="size-8 cursor-pointer transition-all">
                              <AvatarImage
                                src={
                                  isin
                                    ? `https://assets.parqet.com/logos/isin/${isin}`
                                    : `https://assets.parqet.com/logos/${category}/${symbol}`
                                }
                              />
                              <AvatarFallback className="font-thin text-xs">
                                {name.toUpperCase().substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <p className="truncate text-sm">{name}</p>
                          <div className="flex justify-between">
                            <p className="text-sm italic">
                              {isVisible
                                ? formatCurrency.format(amountBuyInProgress)
                                : "••••"}
                            </p>
                            <p className="text-sm italic">{type}</p>
                          </div>
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
            </>
          ) : (
            <p>Aucun investissement trouvé.</p>
          )}
        </div>
      </div>
    </section>
  );
}
