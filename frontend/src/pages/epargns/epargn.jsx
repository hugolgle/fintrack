import Header from "../../components/headers";
import { useNavigate } from "react-router";
import BoxInfos from "../../components/boxs/boxInfos";
import { useQuery } from "@tanstack/react-query";
import { fetchAccounts } from "../../services/epargn.service";
import { HttpStatusCode } from "axios";
import Loader from "../../components/loaders/loader";
import {
  ArrowBigLeft,
  ChevronLeft,
  CirclePlus,
  Euro,
  PiggyBank,
  Plus,
  Wallet,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { RadialChart } from "../../components/chartss/radialChart";
import LoaderDots from "../../components/loaders/loaderDots";
import ModalTable from "./modal/modalTable";
import { ROUTES } from "../../components/route";
import { formatCurrency } from "../../utils/fonctionnel";
import { renderCustomLegend } from "../../components/legends";
import Container from "../../components/containers/container";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormAddAccount } from "./formAddAccount";
import { ChartLine } from "../../components/chartss/chartLine";
import { months } from "../../utils/other";
import { useEffect, useState } from "react";
import SkeletonDashboard from "../../components/skeletonBoard";
import { useAmountVisibility } from "../../context/AmountVisibilityContext";

export default function Epargn() {
  const navigate = useNavigate();
  const { isVisible } = useAmountVisibility();
  const {
    isLoading,
    data: accounts,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["fetchAccounts"],
    queryFn: async () => {
      const response = await fetchAccounts();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data || [];
    },
    refetchOnMount: true,
  });

  if (isLoading) return <SkeletonDashboard />;

  const groupedTransactions = accounts.reduce((acc, account) => {
    const accountTransactions = account.transactions.map((transaction) => ({
      ...transaction,
      accountName: account.name,
      accountId: account._id,
      createdAt: transaction.createdAt,
    }));
    return acc.concat(accountTransactions);
  }, []);

  const mergedTransactions = Object.values(
    groupedTransactions
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .reduce((acc, transaction) => {
        const { _id, type, fromAccount, toAccount } = transaction;

        if (type === "transfer") {
          if (!acc[_id]) {
            acc[_id] = {
              _id,
              type: "transfer",
              amount: transaction.amount,
              date: transaction.date,
              fromAccount: null,
              toAccount: null,
            };
          }

          if (fromAccount && !acc[_id].toAccount) {
            acc[_id].toAccount = transaction.accountName;
          }

          if (toAccount && !acc[_id].fromAccount) {
            acc[_id].fromAccount = transaction.accountName;
          }

          acc[_id].amount += transaction.amount;
        } else {
          acc[_id] = {
            _id,
            type: transaction.type,
            accountName: transaction.accountName,
            amount: transaction.amount,
            date: transaction.date,
            fromAccount: null,
            toAccount: null,
          };
        }

        return acc;
      }, {})
  );

  const getAccountName = (accountId) => {
    const account = accounts?.find((acc) => acc._id === accountId);
    return account?.name || "-";
  };

  const totalAmount = accounts.reduce((sum, item) => sum + item.balance, 0);

  const chartData = accounts.map((account) => {
    return { name: account.name, balance: account.balance };
  });

  const transformedData = chartData.map((item, key) => ({
    name: item.name,
    amount: item.balance,
    pourcentage: (item.balance / totalAmount) * 100,
    fill: `hsl(var(--chart-${key + 1}))`,
  }));

  const chartConfig = chartData.reduce((config, { name }, key) => {
    config[name] = {
      label: name,
      color: `hsl(var(--chart-${key + 1}))`,
    };
    return config;
  }, {});

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
      transaction.accountName ?? transaction.fromAccount,
      transaction.toAccount ?? "-",
      new Date(transaction.date).toLocaleDateString(),
      isVisible ? formatCurrency.format(transaction.amount) : "••••",
    ];
  };

  const data = accounts.flatMap((account) => account.monthlyStatements);

  const grouped = data.reduce((acc, item) => {
    const dateObj = new Date(item.date);
    const year = dateObj.getFullYear();
    const monthIndex = dateObj.getMonth();
    const key = `${year}-${monthIndex}`;

    if (!acc[key]) {
      acc[key] = {
        month: months[monthIndex],
        year,
        amount: 0,
      };
    }

    acc[key].amount += item.balance;

    return acc;
  }, {});

  const sorted = Object.values(grouped).sort((a, b) => {
    const dateA = new Date(a.year, months.indexOf(a.month));
    const dateB = new Date(b.year, months.indexOf(b.month));
    return dateA - dateB;
  });

  const dataGraph = sorted.slice(-12);

  const firstValue = dataGraph[0]?.amount || 0;
  const lastValue = dataGraph[dataGraph.length - 1]?.amount || 0;
  const growth = lastValue - firstValue;
  const growthPercentage = firstValue !== 0 ? (growth / firstValue) * 100 : 0;

  return (
    <section className="w-full">
      <Header
        title="Mon Épargne"
        subtitle="Gérez vos comptes d'épargne et suivez vos transactions"
        isFetching={isFetching}
        navigation={
          <Dialog modal>
            <DialogTrigger>
              {accounts?.length !== 0 && (
                <Button>
                  <Plus />
                  <p className="hidden md:block">Créer un compte</p>
                </Button>
              )}
            </DialogTrigger>
            <DialogContent>
              <FormAddAccount refetch={refetch} />
            </DialogContent>
          </Dialog>
        }
      />
      {accounts?.length > 1 ? (
        <div className="flex flex-col gap-4 animate-fade">
          <div className="flex flex-col lg:flex-row w-full gap-4">
            <BoxInfos
              title="Épargne totale"
              value={totalAmount}
              isAmount
              icon={<PiggyBank size={15} color="grey" />}
            />
            <BoxInfos
              title="Croissance annuelle"
              value={
                growthPercentage > 0 ? (
                  <p className="text-green-500">{`+${growthPercentage.toFixed(0)} %`}</p>
                ) : (
                  <p className="text-red-500">{`${growthPercentage.toFixed(0)} %`}</p>
                )
              }
              icon={<PiggyBank size={15} color="grey" />}
            />
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-4">
            <div className="lg:w-2/3 flex flex-col gap-4">
              <Container>
                <h2 className="text-left">Évolution de l'épargne</h2>
                <p className="text-left text-sm text-muted-foreground">
                  Progression de votre épargne sur les 12 derniers mois
                </p>

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
              </Container>
              <Container>
                <div className="mb-4">
                  <h2 className="text-left">Mes comptes d'épargne</h2>
                  <p className="text-left text-sm text-muted-foreground">
                    Vue d'ensemble de vos différents produits d'épargne
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {accounts.length > 0 ? (
                    accounts.map((account) => {
                      const percent = account.maxBalance
                        ? (account.balance * 100) / account.maxBalance
                        : 0;

                      return (
                        <div
                          key={account._id}
                          className="flex flex-col justify-between items-center p-4 gap-2 ring-1 ring-secondary/20 hover:ring-secondary rounded-md cursor-pointer group transition-all"
                          onClick={() =>
                            navigate(
                              ROUTES.ACCOUNT_BY_ID.replace(":id", account._id)
                            )
                          }
                        >
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-muted-foreground rounded-full flex items-center justify-center">
                                <Wallet className="h-5 w-5" />
                              </div>
                              <p className="font-semibold">{account.name}</p>
                              <ChevronRight
                                size={14}
                                className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                              />
                            </div>
                            <div>
                              <p className="text-lg font-bold">
                                {isVisible
                                  ? formatCurrency.format(account.balance)
                                  : "••••"}
                              </p>
                              <p className="text-sm text-muted-foreground text-right">
                                Taux: {account.interestRate}%
                              </p>
                            </div>
                          </div>

                          {account.maxBalance && (
                            <div className="relative flex gap-2 items-center w-full">
                              <Progress
                                value={percent > 100 ? 100 : percent}
                                className="w-full h-[2px]"
                              />
                              <p className="text-muted-foreground italic text-[10px] text-nowrap">
                                {percent.toFixed(2)} %
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Aucun compte d'épargne trouvé.
                    </p>
                  )}
                </div>
              </Container>
            </div>

            <div className="lg:w-1/3 flex flex-col gap-4">
              <Container>
                <h2 className="text-left">Répartitions</h2>
                {totalAmount !== "0.00" ? (
                  <RadialChart
                    chartData={transformedData}
                    chartConfig={chartConfig}
                    total={totalAmount}
                    fontSizeTotal={8}
                    inner={50}
                    outer={90}
                    legend={renderCustomLegend}
                  />
                ) : (
                  <p className="h-[225px] ">Aucune donnée</p>
                )}
              </Container>
              <Container>
                <div className="flex justify-between w-full cursor-pointer items-center">
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
                    title="Transactions"
                    description="Liste des transactions."
                    data={mergedTransactions}
                    getAccountName={getAccountName}
                    formatData={formatData}
                    columns={columns}
                  />
                </div>
                <div className="w-full text-sm mt-4">
                  <div className="flex w-full font-thin italic pb-2">
                    {columns?.map(({ id, name }) => (
                      <p key={id} className="w-1/5 text-center">
                        {name}
                      </p>
                    ))}
                  </div>
                  <Separator className="w-4/5 mx-auto bg-secondary" />
                  {mergedTransactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5)
                    .map((transaction, index) => (
                      <div
                        key={index}
                        className="flex w-full items-center py-2 text-xs"
                      >
                        <p className="w-1/5">
                          {transaction.type === "withdraw"
                            ? "Retrait"
                            : transaction.type === "transfer"
                              ? "Transfert"
                              : transaction.type === "deposit"
                                ? "Dépôt"
                                : transaction.type === "interest" && "Intérêts"}
                        </p>
                        <p className="w-1/5">
                          {transaction.accountName ?? transaction.fromAccount}
                        </p>
                        <p className="w-1/5">{transaction.toAccount ?? "-"}</p>
                        <p className="w-1/5">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <p className="italic px-2 py-[2px] w-1/5 text-center">
                          <span
                            className={`px-2 py-1 w-fit text-center rounded-md ${
                              transaction?.type !== "transfer"
                                ? transaction?.amount < 0
                                  ? "bg-red-500 text-red-900"
                                  : "bg-green-500 text-green-900"
                                : ""
                            }`}
                          >
                            {isVisible
                              ? transaction?.type === "transfer"
                                ? formatCurrency.format(
                                    Math.abs(transaction.amount)
                                  )
                                : formatCurrency.format(transaction.amount)
                              : "••••"}
                          </span>
                        </p>
                      </div>
                    ))}
                </div>
              </Container>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Aucun compte enregistré</h2>
          <p className="text-muted-foreground">
            Commencez par ajouter une nouveau compte pour suivre vos paiements
            et gérer vos finances.
          </p>
          <Dialog modal>
            <DialogTrigger>
              <Button>
                <Plus />
                <p className="hidden md:block">Nouveau compte</p>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <FormAddAccount refetch={refetch} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </section>
  );
}
