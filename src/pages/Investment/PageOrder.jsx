import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { HttpStatusCode } from "axios";
import { format } from "date-fns";
import { fetchInvestments } from "../../Service/Investment.service.jsx";
import Header from "../../composant/Header.jsx";
import Loader from "../../composant/Loader/Loader";
import { formatCurrency } from "../../utils/fonctionnel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Tableau from "../../composant/Table/Table.jsx";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Eye } from "lucide-react";
import { ROUTES } from "../../composant/Routes.jsx";
import { calculTotalAmount } from "../../utils/calcul.js";

export function PageOrder() {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    performSearch(event.target.value);
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

  const formatData = (row) => {
    return [
      row.type,
      row.name,
      format(row?.date, "PP", { locale: fr }),
      formatCurrency.format(row.amount),
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
          <MoreHorizontal className="cursor-pointer" />
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
    ({ _id, name, type, symbol, amountBuy, transaction }) => {
      return {
        _id: transaction._id,
        idInvest: _id,
        type,
        symbol,
        name,
        date: transaction[0]?.date,
        amount: amountBuy,
      };
    }
  );

  const performSearch = (term) => {
    const filteredData = displayData.filter((item) => {
      const nameMatches = item.name?.toLowerCase().includes(term.toLowerCase());
      const typeMatches = item.type?.toLowerCase().includes(term.toLowerCase());
      const isSaleMatches = item.isSale
        ?.toLowerCase()
        .includes(term.toLowerCase());
      const symbolMatches = item.symbol
        ?.toLowerCase()
        .includes(term.toLowerCase());
      const dateMatches = item.date?.toLowerCase().includes(term.toLowerCase());
      const amountMatches = item.amount
        .toString()
        .toLowerCase()
        .includes(term.toLowerCase());

      return (
        nameMatches ||
        typeMatches ||
        dateMatches ||
        amountMatches ||
        symbolMatches ||
        isSaleMatches
      );
    });
    setSearchResults(filteredData);
  };

  const data = searchTerm ? searchResults : displayData;

  const amountTotal = calculTotalAmount(data);

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header
          title="Mon portefeuille"
          btnReturn
          isFetching={isFetching}
          switchComponent={
            <div className="flex items-center gap-2">
              <Switch
                id="new"
                checked={mode}
                onCheckedChange={handleSwitchMode}
                size={3}
              />
              <Label htmlFor="new" className="text-xs italic">
                Vue Tableau
              </Label>
            </div>
          }
          btnAdd={ROUTES.ADD_ORDER}
          btnSearch={{ handleSearchChange, searchTerm }}
        />
        <div className="flex flex-wrap w-full justify-center gap-4 justify-left p-4 animate-fade">
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
                  amountTotal={amountTotal}
                />
              ) : (
                data?.map(({ idInvest, name, type, date, symbol, amount }) => {
                  const category = type === "Crypto" ? "crypto" : "symbol";
                  const theDate = date ? new Date(date) : null;

                  return (
                    <Link
                      key={idInvest}
                      to={ROUTES.INVESTMENT_BY_ID.replace(":id", idInvest)}
                      className={`w-52 h-32 flex animate-fade flex-col justify-between font-thin rounded-2xl p-4 transition-all ring-[1px] hover:scale-95 hover:bg-opacity-80 ${getHoverClass(
                        type
                      )}`}
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
                          {formatCurrency.format(amount)}
                        </p>
                        <p className="text-sm italic">{type}</p>
                      </div>
                    </Link>
                  );
                })
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
