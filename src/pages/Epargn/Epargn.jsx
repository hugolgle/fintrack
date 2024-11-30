import { HandCoins } from "lucide-react";
import Header from "../../composant/Header";
import { useNavigate } from "react-router";
import BoxInfos from "../../composant/Box/BoxInfos";
import { useQuery } from "@tanstack/react-query";
import { fetchAccounts } from "../../Service/Epargn.service";
import { HttpStatusCode } from "axios";
import Loader from "../../composant/Loader/Loader";
import { Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { RadialChart } from "../../composant/Charts/RadialChart";
import LoaderDots from "../../composant/Loader/LoaderDots";
import ModalTable from "./Modal/ModalTable";
import { ROUTES } from "../../composant/Routes";
import { formatEuro } from "../../utils/fonctionnel";

export default function Epargn() {
  const navigate = useNavigate();

  const {
    isLoading,
    data: accounts,
    isFetching,
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

  if (isLoading) return <Loader />;

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

  const totalAmount = accounts.reduce(
    (sum, item) => sum + parseFloat(item.balance),
    0
  );

  const chartData = accounts.map((account) => {
    return { name: account.name, balance: account.balance };
  });

  const transformedData = chartData.map((item, key) => ({
    name: item.name,
    amount: parseFloat(item.balance),
    pourcentage: (parseFloat(item.balance) / totalAmount) * 100,
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
    { id: 1, name: "Type" },
    { id: 2, name: "Compte" },
    { id: 3, name: "Vers" },
    { id: 4, name: "Date" },
    { id: 5, name: "Montant" },
  ];

  const formatData = (transaction) => {
    return [
      transaction.type === "withdraw"
        ? "Retrait"
        : transaction.type === "transfer"
          ? "Transfert"
          : "Dépôt",
      transaction.accountName ?? transaction.fromAccount,
      transaction.toAccount ?? "-",
      new Date(transaction.date).toLocaleDateString(),
      formatEuro.format(transaction.amount),
    ];
  };

  return (
    <section className="w-full">
      <Header title="Épargne" btnAdd="add" btnAction isFetching={isFetching} />
      <div className="flex flex-col gap-4 animate-fade">
        <div className="flex w-full gap-4">
          {Array.isArray(accounts) &&
            accounts.map((account) => (
              <BoxInfos
                key={account.id}
                onClick={() =>
                  navigate(ROUTES.ACCOUNT_BY_ID.replace(":id", account._id))
                }
                title={account.name}
                value={account.balance.toFixed(2)}
                plafond={account.maxBalance}
                isAmount
                icon={<Wallet size={15} color="grey" />}
              />
            ))}
        </div>
        <div className="w-full flex gap-4">
          <div className="w-1/3 bg-primary-foreground ring-1 ring-border h-fit rounded-xl p-4">
            <h2 className=" text-left">Répartitions</h2>
            {!isFetching ? (
              totalAmount !== "0.00" ? (
                <RadialChart
                  chartData={transformedData}
                  chartConfig={chartConfig}
                  total={totalAmount.toFixed(2)}
                  fontSizeTotal={8}
                  inner={60}
                  outer={80}
                />
              ) : (
                <p className="h-[225px] ">Aucune donnée</p>
              )
            ) : (
              <LoaderDots />
            )}
          </div>
          <div className="w-2/3 h-fit ring-1 ring-border bg-primary-foreground rounded-xl p-4">
            <div className="flex justify-between w-full cursor-pointer items-center">
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
                data={mergedTransactions}
                getAccountName={getAccountName}
                formatData={formatData}
                columns={columns}
              />
            </div>
            <div className="w-full text-sm mt-4">
              <div className="flex w-full font-thin italic pb-2">
                {columns?.map(({ name }) => (
                  <p className="w-1/5 text-center">{name}</p>
                ))}
              </div>
              <Separator className="w-4/5 mx-auto" />
              {mergedTransactions.slice(0, 6).map((transaction, index) => (
                <div
                  key={index}
                  className="flex w-full items-center py-2 text-xs"
                >
                  <p className="w-1/5">
                    {transaction.type === "withdraw"
                      ? "Retrait"
                      : transaction.type === "transfer"
                        ? "Transfert"
                        : transaction.type === "deposit" && "Dépôt"}
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
                      className={`px-2 py-1 w-fit text-center rounded-sm bg-opacity-40 ${
                        transaction?.type !== "transfer"
                          ? transaction?.amount < 0
                            ? "bg-red-300 text-red-900 dark:bg-red-300 dark:text-red-900"
                            : "bg-green-300 text-green-900 dark:bg-green-300 dark:text-green-900"
                          : ""
                      }`}
                    >
                      {transaction?.type === "transfer"
                        ? formatEuro.format(Math.abs(transaction.amount))
                        : formatEuro.format(transaction.amount)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/3 bg-primary-foreground ring-1 ring-border h-fit rounded-xl p-4">
            <h2 className=" text-left">Répartitions</h2>
            {!isFetching ? (
              totalAmount !== "0.00" ? (
                <RadialChart
                  chartData={transformedData}
                  chartConfig={chartConfig}
                  total={totalAmount.toFixed(2)}
                  fontSizeTotal={8}
                  inner={60}
                  outer={80}
                />
              ) : (
                <p className="h-[225px] ">Aucune donnée</p>
              )
            ) : (
              <LoaderDots />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
