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
    const dateA = a.transaction[0]?.date
      ? new Date(a.transaction[0].date)
      : new Date(0);
    const dateB = b.transaction[0]?.date
      ? new Date(b.transaction[0].date)
      : new Date(0);
    return dateB - dateA;
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
      row.type,
      row.name,
      format(row?.date, "PP", { locale: fr }),
      isVisible ? formatCurrency.format(row.amount) : "••••",
    ];
  };

  const avatar = (item) => {
    const category = item.type === "Crypto" ? "crypto" : "symbol";
    return (
      <Avatar key="avatar" className="size-6">
        <AvatarImage
          src={`https://assets.parqet.com/logos/${category}/${item.symbol}`}
        />
      </Avatar>
    );
  };

  const columns = [
    { id: 2, name: "Type", key: "type" },
    { id: 4, name: "Nom", key: "name" },
    { id: 5, name: "Date", key: "date" },
    { id: 6, name: "Montant", key: "amount" },
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

  const displayData = dataInvestments.map(
    ({
      _id,
      name,
      type,
      symbol,
      amountBuy,
      amountSale,
      transaction,
      createdAt,
    }) => {
      return {
        _id: transaction._id,
        idInvest: _id,
        type,
        symbol,
        name,
        date: transaction[0]?.date,
        amount: amountSale + amountBuy,
        createdAt,
      };
    }
  );

  const data = displayData;

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
                Vue Tableau
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
              {mode ? (
                <Tableau
                  formatData={formatData}
                  data={data}
                  columns={columns}
                  type="investments"
                  isFetching={isFetching}
                  action={action}
                  firstItem={avatar}
                  fieldsFilter={[{ key: "type", fieldName: "Type" }]}
                  dateFilter
                />
              ) : (
                <div className="flex flex-wrap w-full justify-center gap-4 justify-left p-4 animate-fade">
                  {data?.map(
                    ({ idInvest, name, type, date, symbol, amount }) => {
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
                                src={`https://assets.parqet.com/logos/${category}/${symbol}`}
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
                                ? formatCurrency.format(amount)
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
