import React, { useState } from "react";
import { useParams } from "react-router";
import Header from "../../composant/Header";
import { fetchAccount, fetchAccounts } from "../../Service/Epargn.service";
import { useQuery } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { currentDate, months } from "../../utils/other";
import LoaderDots from "../../composant/Loader/LoaderDots";
import { ChartLine } from "../../composant/Charts/ChartLine";
import { Pencil } from "lucide-react";
import ModalTable from "./Modal/ModalTable";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ROUTES } from "../../composant/Routes";
import { formatCurrency } from "../../utils/fonctionnel";
import { FormEditAccount } from "./FormEditAccount";

export default function PageAccount() {
  const { id } = useParams();

  const {
    data: account,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["fetchAccount", id],
    queryFn: async () => {
      const response = await fetchAccount(id);
      if (response?.status !== HttpStatusCode.Ok) {
        toast.warn(response?.response?.data?.message || "Erreur");
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const { data: accounts } = useQuery({
    queryKey: ["fetchAccounts"],
    queryFn: async () => {
      const response = await fetchAccounts();
      if (response?.status !== HttpStatusCode.Ok) {
        toast.warn(response?.response?.data?.message || "Erreur");
      }
      return response?.data;
    },
    refetchOnMount: true,
    enabled: !!account,
  });

  const { year: currentYear } = currentDate();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const data = account?.monthlyStatements.map((statement) => {
    const statementDate = new Date(statement.date);
    return {
      date: isNaN(statementDate) ? null : statementDate,
      balance: statement.balance,
    };
  });

  const montantAccountByMonth = months.map((_, index) => {
    const montantAccount = data?.find(
      (statement) =>
        statement.date?.getFullYear() === selectedYear &&
        statement.date?.getMonth() === index
    );
    return montantAccount ? montantAccount.balance : 0;
  });

  const dataGraph = months.map((month, index) => ({
    month,
    year: selectedYear,
    amount: montantAccountByMonth[index],
  }));

  const clickNextYear = () => setSelectedYear(selectedYear + 1);
  const clickLastYear = () => setSelectedYear(selectedYear - 1);

  const getAccountName = (accountId) => {
    const account = accounts?.find((acc) => acc._id === accountId);
    return account?.name || "Compte inconnu";
  };

  const fillPercentage = (account?.balance * 100) / account?.maxBalance;

  const columns = [
    { id: 1, name: "Type", key: "type" },
    { id: 2, name: "Compte", key: "account" },
    { id: 3, name: "Vers", key: "toAccount" },
    { id: 4, name: "Date", key: "date" },
    { id: 5, name: "Montant", key: "amount" },
  ];

  const formatData = (transaction) => {
    return [
      transaction.type === "withdraw"
        ? "Retrait"
        : transaction.type === "transfer"
          ? "Transfert"
          : "Dépôt",
      account?.name || "Compte inconnu",
      transaction.fromAccount
        ? getAccountName(transaction.fromAccount)
        : transaction.toAccount
          ? getAccountName(transaction.toAccount)
          : "-",
      new Date(transaction.date).toLocaleDateString(),
      `${transaction.amount > 0 ? "+" : ""}${formatCurrency.format(transaction.amount)}`,
    ];
  };

  return (
    <section className="w-full">
      <Header
        title={account?.name}
        btnReturn
        btnAdd={ROUTES.ACTION_EPARGN}
        isFetching={isFetching}
      />
      <div className="flex w-full gap-4 animate-fade">
        <div className="w-4/5 flex flex-col h-fit ring-1 ring-border justify-between bg-secondary rounded-xl p-4">
          <h2 className=" text-left">Graphique</h2>
          {!isFetching ? (
            <ChartLine
              data={dataGraph}
              defaultConfig={{
                amount: {
                  label: "Montant",
                  color: "hsl(var(--chart-12))",
                  visible: true,
                },
                text: {
                  color: "hsl(var(--foreground))",
                },
              }}
              maxValue={Math.max(...dataGraph.map((item) => item.amount))}
            />
          ) : (
            <LoaderDots />
          )}
          <div className="flex flex-row gap-4 w-fit mx-auto items-center justify-between">
            <ChevronLeft
              size={25}
              className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
              onClick={clickLastYear}
            />
            <p className="font-thin text-sm">{selectedYear}</p>
            <ChevronRight
              size={25}
              className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
              onClick={clickNextYear}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4  w-1/5">
          <div className="bg-secondary ring-1 ring-border rounded-xl h-fit p-4">
            <div className="flex w-full justify-between items-center mb-4">
              <h2 className="text-left">Transactions</h2>

              <ModalTable
                btnOpen={
                  <p className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all">
                    Voir plus
                    <ChevronRight
                      size={12}
                      className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                    />
                  </p>
                }
                columns={columns}
                formatData={formatData}
                data={account?.transactions?.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )}
                getAccountName={getAccountName}
                title="Transactions"
                description="Liste des transactions."
              />
            </div>
            {account?.transactions?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {account.transactions
                  .slice(0, 4)
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((transaction, index) => {
                    return (
                      <div
                        key={transaction._id || index}
                        className="flex justify-between items-center rounded-lg"
                      >
                        <div className="text-left">
                          <p className="text-xs">
                            {transaction.type === "transfer"
                              ? transaction.fromAccount
                                ? `Transfert reçu de ${getAccountName(
                                    transaction.fromAccount
                                  )}`
                                : `Transfert vers ${getAccountName(
                                    transaction.toAccount
                                  )}`
                              : transaction.type === "deposit"
                                ? "Dépôt"
                                : transaction.type === "withdraw"
                                  ? "Retrait"
                                  : "Opération inconnue"}
                          </p>
                          <p className="italic text-[10px] text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p
                          className={`italic px-2 py-[2px] rounded-sm bg-opacity-40 text-[11px] ${
                            transaction?.amount < 0
                              ? "bg-colorExpense text-red-900 dark:bg-colorExpense dark:text-red-900"
                              : "bg-colorRevenue text-green-900 dark:bg-colorRevenue dark:text-green-900"
                          }`}
                        >
                          {transaction?.amount > 0
                            ? `+${formatCurrency.format(transaction.amount)}`
                            : formatCurrency.format(transaction.amount)}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="italic text-xs text-gray-500">
                Aucune transactions trouvé !
              </p>
            )}
          </div>

          <div className="ring-1 ring-border bg-secondary h-fit rounded-xl p-4">
            <div className="flex w-full justify-between items-center mb-4">
              <h2 className=" text-left">Caractéristiques</h2>
              <Dialog>
                <DialogTrigger>
                  <div className="cursor-pointer">
                    <Pencil size={14} strokeWidth={1} />
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <FormEditAccount account={account} refetch={refetch} />
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs">Solde</span>
                <span className="italic text-xs">
                  {!isLoading ? formatCurrency.format(account?.balance) : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Plafond</span>
                <span className="italic text-xs">
                  {!isLoading
                    ? formatCurrency.format(account?.maxBalance)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Utilisation</span>
                <span className="italic text-xs">
                  {!isLoading ? fillPercentage.toFixed(2) : "-"} %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Taux d'intérêts </span>
                <span className="italic text-xs">
                  {!isLoading ? account?.interestRate.toFixed(2) : "-"} %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Intérets cumulé</span>
                <span className="italic text-xs">
                  {!isLoading
                    ? `≈ ${formatCurrency.format(account?.amountInterest)}`
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
