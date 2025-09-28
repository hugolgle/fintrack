import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getLastOperations } from "../../utils/operations.js";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { calculTotalByMonth } from "../../utils/calcul.js";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { currentDate, months } from "../../utils/other.js";
import typeCreditList from "../../../public/typeCredit.json";
import { fetchTransactions } from "../../services/transaction.service.jsx";
import { fetchInvestments } from "../../services/investment.service.jsx";
import { fetchAccounts } from "../../services/epargn.service.jsx";
import Header from "../../components/headers.jsx";
import BoxInfos from "../../components/boxs/boxInfos.jsx";
import Container from "../../components/containers/container.jsx";
import {
  ChevronRight,
  CircleDollarSign,
  WalletCards,
  Landmark,
  HandCoins,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import { ROUTES } from "../../components/route.jsx";
import { categoryDepense } from "../../../public/categories.json";
import * as Icons from "lucide-react";
import { HttpStatusCode } from "axios";
import { toast } from "sonner";
import { TYPES } from "../../staticDatas/staticData.js";
import { FormTransac } from "../finances/formFinance.jsx";
import { fetchCredits } from "../../services/credit.service.jsx";
import FormAddInvestmentMain from "../investments/formAddInvestmentMain.jsx";
import { useAuth } from "../../context/authContext.jsx";
import SkeletonBoard from "../../components/skeletonBoard.jsx";
import { useAmountVisibility } from "../../context/AmountVisibilityContext.jsx";
import { ChartLine } from "../../components/chartss/chartLine.jsx";

export default function Dashboard() {
  const { isVisible } = useAmountVisibility();
  const navigate = useNavigate();
  const { user: dataUser } = useAuth();
  const { month: currentMonth, year: currentYear } = currentDate();
  const currentMonthYear = `${currentYear}${currentMonth}`;
  const {
    isLoading: loadingTransacs,
    data: dataTransacs,
    isFetching: isFetchingTransacs,
    refetch,
  } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const res = await fetchTransactions();
      if (res?.status !== HttpStatusCode.Ok)
        toast.warn(res?.response?.data?.message || "Erreur");
      return res.data;
    },
    refetchOnMount: true,
  });
  const { isLoading: loadingAccounts, data: dataAccounts } = useQuery({
    queryKey: ["fetchAccounts"],
    queryFn: async () => {
      const res = await fetchAccounts();
      if (res?.status !== HttpStatusCode.Ok)
        toast.warn(res?.response?.data?.message || "Erreur");
      return res.data;
    },
    refetchOnMount: true,
  });

  const { data: dataCredit } = useQuery({
    queryKey: ["fetchCredits"],
    queryFn: async () => {
      const res = await fetchCredits();
      if (res?.status !== HttpStatusCode.Ok)
        toast.warn(res?.response?.data?.message || "Erreur");
      return res.data;
    },
    refetchOnMount: true,
  });

  const {
    isLoading: loadingInvests,
    data: dataInvests,
    isFetching: isFetchingInvests,
    refetch: refetchInvests,
  } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const res = await fetchInvestments();
      if (res?.status !== HttpStatusCode.Ok)
        toast.warn(res?.response?.data?.message || "Erreur");
      return res.data;
    },
    refetchOnMount: true,
  });

  const dataTransacsInvest = useMemo(
    () =>
      dataInvests?.flatMap((inv) =>
        inv.transaction
          .filter((trans) => {
            return trans.type !== "dividend";
          })
          .map((trans) => ({
            _id: trans._id,
            title: inv.name,
            amount: Math.abs(trans.amount),
            date: trans.date,
          }))
      ) || [],
    [dataInvests]
  );
  const amountRevenuesMonth = useMemo(
    () => calculTotalByMonth(dataTransacs, TYPES.INCOME, currentMonthYear),
    [dataTransacs, currentMonthYear]
  );
  const amountExpensesMonth = useMemo(
    () => calculTotalByMonth(dataTransacs, TYPES.EXPENSE, currentMonthYear),
    [dataTransacs, currentMonthYear]
  );

  const amountResult = Array.isArray(dataInvests)
    ? dataInvests
        .filter(
          (item) =>
            Array.isArray(item.transaction) &&
            item.transaction.some((t) => t.type === "sell")
        )
        .reduce((total, item) => {
          const sale = item.amountSale || 0;
          const buy = item.amountBuy || 0;
          return total + (sale + buy);
        }, 0)
    : 0;
  const amountBuy = Array.isArray(dataInvests)
    ? dataInvests.reduce((total, item) => {
        const sale = item.amountSale || 0;
        const buy = item.amountBuy || 0;
        return total + (sale + buy);
      }, 0)
    : 0;

  const amountInvest = amountBuy - amountResult;

  const { previousMonth, previousYear } = useMemo(() => {
    let m = currentMonth - 1,
      y = currentYear;
    if (m === 0) {
      m = 12;
      y--;
    }
    return { previousMonth: String(m).padStart(2, "0"), previousYear: y };
  }, [currentMonth, currentYear]);
  const previousDate = `${previousYear}${previousMonth}`;
  const amountRevenuesLastMonth = useMemo(
    () => calculTotalByMonth(dataTransacs, TYPES.INCOME, previousDate),
    [dataTransacs, previousDate]
  );
  const amountExpensesLastMonth = useMemo(
    () => calculTotalByMonth(dataTransacs, TYPES.EXPENSE, previousDate),
    [dataTransacs, previousDate]
  );
  const lastTransactions = useMemo(
    () => getLastOperations(dataTransacs, null, 4, false),
    [dataTransacs]
  );

  const lastInvestissements = useMemo(
    () => getLastOperations(dataTransacsInvest, null, 4, false),
    [dataTransacsInvest]
  );

  const amountEpargn = useMemo(
    () => (dataAccounts || []).reduce((sum, acc) => sum + acc.balance, 0),
    [dataAccounts]
  );

  const percentInvest =
    (Math.abs(amountInvest) * 100) / (Math.abs(amountInvest) + amountEpargn);
  const percentEpargn =
    (amountEpargn * 100) / (Math.abs(amountInvest) + amountEpargn);

  const amountHeritage = amountEpargn + Math.abs(amountInvest);

  const data = dataAccounts?.flatMap((account) => account.monthlyStatements);

  const grouped = (data ?? [])?.reduce((acc, item) => {
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

  if (loadingTransacs || loadingAccounts || loadingInvests)
    return <SkeletonBoard />;

  return (
    <section className="w-full">
      <Header
        title="Tableau de bord"
        subtitle={`Bienvenue sur votre tableau de bord, ${dataUser?.prenom || "utilisateur"} !`}
        isFetching={isFetchingInvests || isFetchingTransacs}
        navigation={
          <div className="flex items-center gap-2 ">
            <Dialog>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-colorRevenue hover:bg-colorRevenue/90 active:scale-90 transition-all"
                      size={"icon"}
                    >
                      <Icons.Plus className="cursor-pointer transition-all" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nouvelle recette</p>
                </TooltipContent>
              </Tooltip>

              <DialogContent>
                <FormTransac refetch={refetch} type={TYPES.INCOME} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-colorExpense hover:bg-colorExpense/90 active:scale-90 transition-all"
                      size={"icon"}
                    >
                      <Icons.Plus className="cursor-pointer transition-all" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nouvelle dépense</p>
                </TooltipContent>
              </Tooltip>

              <DialogContent>
                <FormTransac refetch={refetch} type={TYPES.EXPENSE} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-colorInvest hover:bg-colorInvest/90 active:scale-90 transition-all"
                      size={"icon"}
                    >
                      <Icons.Plus className="cursor-pointer transition-all" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nouveau investissement</p>
                </TooltipContent>
              </Tooltip>

              <DialogContent>
                <FormAddInvestmentMain refetch={refetchInvests} />
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div className="flex flex-col gap-4 animate-fade">
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <BoxInfos
            onClick={() =>
              navigate(
                ROUTES.REVENUE_BY_MONTH.replace(":year", currentYear).replace(
                  ":month",
                  currentMonth
                )
              )
            }
            type="revenue"
            title="Revenus Mensuels"
            icon={<CircleDollarSign size={15} color="grey" />}
            value={amountRevenuesMonth}
            valueLast={amountRevenuesLastMonth || null}
            isAmount
          />
          <BoxInfos
            onClick={() =>
              navigate(
                ROUTES.EXPENSE_BY_MONTH.replace(":year", currentYear).replace(
                  ":month",
                  currentMonth
                )
              )
            }
            type="depense"
            title="Dépenses Mensuelles"
            icon={<WalletCards size={15} color="grey" />}
            value={amountExpensesMonth}
            valueLast={amountExpensesLastMonth || null}
            isAmount
          />
          <BoxInfos
            onClick={() => navigate(ROUTES.INVESTMENT)}
            type="investment"
            title="Investissement"
            icon={<HandCoins size={15} color="grey" />}
            value={Math.abs(amountInvest)}
            isAmount
          />
          <BoxInfos
            onClick={() => navigate(ROUTES.EPARGN)}
            type="epargn"
            title="Épargne"
            icon={<Landmark size={15} color="grey" />}
            value={amountEpargn}
            isAmount
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          <div className="flex flex-col w-full lg:w-4/5 gap-4">
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
            <div className="flex flex-col lg:flex-row gap-4">
              <Container custom="lg:!w-3/4">
                <div className="flex justify-between mb-4">
                  <div>
                    <h2 className="text-left">Répartition du Patrimoine</h2>
                    <p className="text-left text-sm text-muted-foreground">
                      Distribution de vos actifs financiers
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground text-right">
                    Montant du patrimoine :{" "}
                    <span className="font-semibold">
                      {isVisible
                        ? formatCurrency.format(amountHeritage)
                        : "••••"}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <p>Épargne</p>
                      <p className=" font-semibold">
                        {isVisible
                          ? formatCurrency.format(amountEpargn)
                          : "••••"}
                      </p>
                    </div>

                    <Progress value={percentEpargn} className="h-1" />
                    <p className="text-left text-xs text-muted-foreground">
                      <span className="font-semibold">
                        {percentEpargn.toFixed(0)} %
                      </span>{" "}
                      du patrimoine total
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <p>Investissement</p>
                      <p className=" font-semibold">
                        {isVisible
                          ? formatCurrency.format(Math.abs(amountInvest))
                          : "••••"}
                      </p>
                    </div>
                    <Progress value={percentInvest} className="h-1" />
                    <p className="text-left text-xs text-muted-foreground">
                      <span className="font-semibold">
                        {percentInvest.toFixed(0)} %
                      </span>{" "}
                      du patrimoine total
                    </p>
                  </div>
                </div>
              </Container>
              <Container custom="h-fit lg:!w-2/4">
                <div className="flex justify-between w-full gap-4 mb-4">
                  <h2 className="text-left">Mes crédits</h2>
                  <p
                    className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all"
                    onClick={() => navigate(ROUTES.CREDIT)}
                  >
                    Voir tout
                    <ChevronRight
                      size={12}
                      className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                    />
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dataCredit
                    ?.filter((cre) => cre.isActive === true)
                    ?.map((credit, index) => {
                      const typeInfo =
                        typeCreditList.find((t) => t.key === credit.type) || {};
                      const IconComponent =
                        Icons[typeInfo.icon] || Icons.CreditCard;

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="size-8 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: typeInfo.color || "#ccc",
                              }}
                            >
                              <IconComponent className="size-4" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-sm">{credit.name}</h3>
                              <p className="text-[10px] text-muted-foreground italic">
                                {typeInfo.name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs italic">
                              {isVisible
                                ? formatCurrency.format(credit.balance)
                                : "••••"}
                            </p>
                            <p className="text-[10px] text-muted-foreground italic">
                              {isVisible
                                ? formatCurrency.format(
                                    credit.monthlyPayment + credit.insurance
                                  )
                                : "••••"}{" "}
                              par mois
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Container>
            </div>
          </div>
          <div className="lg:w-1/5 flex flex-col gap-4">
            <Container>
              <div className="flex justify-between w-full mb-4">
                <h2 className="text-nowrap">Dernières transactions</h2>
                <p
                  className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all"
                  onClick={() => navigate(ROUTES.TRANSACTIONS)}
                >
                  Voir tout
                  <ChevronRight
                    size={12}
                    className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                  />
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {lastTransactions.map((op) => (
                  <div
                    key={op._id}
                    className="flex items-center justify-between text-xs"
                  >
                    {" "}
                    <div className="flex flex-row space-x-4 w-4/5">
                      <span>{format(op.date, "dd/MM")}</span>
                      <span className="truncate">{op.title}</span>
                    </div>
                    <p
                      className={`px-2 py-[1px] text-[10px] italic rounded-md ${
                        op.type === TYPES.EXPENSE
                          ? "bg-colorExpense text-red-900"
                          : op.type === TYPES.INCOME &&
                            "bg-colorRevenue text-green-900"
                      }`}
                    >
                      {isVisible ? formatCurrency.format(op.amount) : "••••"}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
            <Container>
              <div className="flex justify-between w-full mb-4">
                <h2 className="text-nowrap">Derniers investissements</h2>
                <p
                  className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all"
                  onClick={() => navigate(ROUTES.INVESTMENT_IN_PROGRESS)}
                >
                  Voir tout
                  <ChevronRight
                    size={12}
                    className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                  />
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {lastInvestissements.map((inv) => (
                  <div
                    key={inv._id}
                    className="flex items-center justify-between text-xs"
                  >
                    {" "}
                    <div className="flex flex-row space-x-4 w-4/5">
                      <span>{format(inv.date, "dd/MM")}</span>
                      <span className="truncate">{inv.title}</span>
                    </div>
                    <p className="text-[10px] italic">
                      {isVisible ? formatCurrency.format(inv.amount) : "••••"}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
            <Container>
              <div className="flex justify-between w-full mb-4">
                <h2 className="text-nowrap">Mes investissements</h2>
                <p
                  className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all"
                  onClick={() => navigate(ROUTES.INVESTMENT_ORDER)}
                >
                  Voir tout
                  <ChevronRight
                    size={12}
                    className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                  />
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {dataInvests
                  ?.sort((a, b) => a.amountBuy - b.amountBuy)
                  .slice(0, 4)
                  .map((item) => {
                    const category =
                      item?.type === "Crypto" ? "crypto" : "symbol";
                    return (
                      <div
                        key={item._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Avatar className="size-6 mr-4">
                            <AvatarImage
                              src={`https://assets.parqet.com/logos/${category}/${item?.symbol}`}
                              alt={item?.name}
                            />
                          </Avatar>
                          <p className="text-xs">{item?.name}</p>
                        </div>
                        <p className="text-[10px] italic text-right">
                          {isVisible
                            ? formatCurrency.format(item.amountBuy)
                            : "••••"}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
}
