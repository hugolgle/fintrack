import React, { useState } from "react";
import { useParams } from "react-router";
import Header from "../../components/headers";
import { fetchAccount, fetchAccounts } from "../../services/epargn.service";
import { useQuery } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { ChevronRight, ChevronLeft, Plus } from "lucide-react";
import { currentDate, months } from "../../utils/other";
import LoaderDots from "../../components/loaders/loaderDots";
import { ChartLine } from "../../components/chartss/chartLine";
import { Pencil } from "lucide-react";
import ModalTable from "./modal/modalTable";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency } from "../../utils/fonctionnel";
import { FormEditAccount } from "./formEditAccount";
import Container from "../../components/containers/container";
import FormAction from "./action";
import { Button } from "@/components/ui/button";
import { useAmountVisibility } from "../../context/AmountVisibilityContext";

export default function PageAccount() {
  const { id } = useParams();
  const { isVisible } = useAmountVisibility();
  const {
    isLoading,
    data: account,
    isFetching,
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
          : transaction.type === "interest"
            ? "Intérêts"
            : transaction.type === "deposit" && "Dépôt",
      account?.name || "Compte inconnu",
      transaction.fromAccount
        ? getAccountName(transaction.fromAccount)
        : transaction.toAccount
          ? getAccountName(transaction.toAccount)
          : "-",
      new Date(transaction.date).toLocaleDateString(),
      `${transaction.amount > 0 ? "+" : ""}${isVisible ? formatCurrency.format(transaction.amount) : "••••"}`,
    ];
  };

  return (
    <section className="w-full">
      <Header
        title={account?.name}
        btnReturn
        navigation={
          <Dialog modal>
            <DialogTrigger>
              <Button>
                <Plus />
                <p className="hidden md:block">Nouveau versement</p>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <FormAction refetch={refetch} accountId={id} />
            </DialogContent>
          </Dialog>
        }
        isFetching={isFetching}
      />
      <div className="flex flex-col md:flex-row w-full gap-4 animate-fade">
        <div className="md:w-4/5">
          <Container>
            <h2 className=" text-left">Graphique</h2>

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
          </Container>
        </div>

        <div className="flex flex-col gap-4 md:w-1/5">
          <Container>
            <div className="flex w-full justify-between items-center mb-4">
              <h2 className="text-left">Transactions</h2>

              <ModalTable
                btnOpen={
                  <p className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all">
                    Voir tout
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
                        className="flex justify-between items-center rounded-md"
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
                                  : transaction.type === "interest" &&
                                    "Intérêts"}
                          </p>
                          <p className="italic text-[10px] text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p
                          className={`italic px-2 py-[2px] rounded-md bg-opacity-40 text-[11px] ${
                            transaction?.amount < 0
                              ? "bg-colorExpense text-red-900 dark:bg-colorExpense dark:text-red-900"
                              : "bg-colorRevenue text-green-900 dark:bg-colorRevenue dark:text-green-900"
                          }`}
                        >
                          {isVisible
                            ? transaction?.amount > 0
                              ? `+${formatCurrency.format(transaction.amount)}`
                              : formatCurrency.format(transaction.amount)
                            : "••••"}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="italic text-xs text-muted-foreground">
                Aucune transactions trouvé !
              </p>
            )}
          </Container>

          <Container>
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
                  {!isLoading
                    ? isVisible
                      ? formatCurrency.format(account?.balance)
                      : "••••"
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Plafond</span>
                <span className="italic text-xs">
                  {!isLoading
                    ? isVisible
                      ? formatCurrency.format(account?.maxBalance)
                      : "••••"
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
                    ? `≈ ${isVisible ? formatCurrency.format(account?.amountInterest) : "••••"}`
                    : "-"}
                </span>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
