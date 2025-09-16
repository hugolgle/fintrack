import { useQuery } from "@tanstack/react-query";
import Header from "../../components/headers.jsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Loader from "../../components/loaders/loader.jsx";
import { ROUTES } from "../../components/route.jsx";
import { HttpStatusCode } from "axios";
import {
  ArrowUp,
  EllipsisVertical,
  Eye,
  Pickaxe,
  Plus,
  Search,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { HandCoins } from "lucide-react";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { BookA } from "lucide-react";
import BoxInfos from "../../components/boxs/boxInfos.jsx";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import { useState } from "react";
import LoaderDots from "../../components/loaders/loaderDots.jsx";
import { currentDate, getLastMonths } from "../../utils/other.js";
import { ChartLine } from "../../components/chartss/chartLine.jsx";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Container from "../../components/containers/container.jsx";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { fetchInvestments } from "../../services/investment.service.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Tableau from "../../components/tables/table.jsx";
import FormAddInvestmentMain from "./formAddInvestmentMain.jsx";
import SkeletonDashboard from "../../components/skeletonBoard.jsx";
import { useAmountVisibility } from "../../context/AmountVisibilityContext.jsx";

export default function BoardInvest() {
  const { isVisible } = useAmountVisibility();
  const navigate = useNavigate();
  const [selectNbMonth, setSelectNbMonth] = useState(12);

  const {
    isLoading,
    data: dataInvests,
    isFetching,
    refetch,
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

  const { month: currentMonth, year: currentYear } = currentDate();
  const currentYearMonth = `${currentYear}${currentMonth}`;
  const [graphMonth, setGraphMonth] = useState(currentYearMonth);

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

  const amountDividend = Array.isArray(dataInvests)
    ? dataInvests.reduce((total, item) => {
        const sum = item.transaction
          ?.filter((t) => t.type === "dividend")
          .reduce((subTotal, t) => subTotal + (t.amount || 0), 0);
        return total + sum;
      }, 0)
    : 0;

  if (isLoading) return <SkeletonDashboard />;

  const totalAmountBuy = dataInvests?.reduce(
    (total, item) => total + (item.amountBuy || 0),
    0
  );

  const categorySums = dataInvests?.reduce((acc, investment) => {
    const type = investment.type;
    const amountBuy = investment.amountBuy || 0;

    if (acc[type]) {
      acc[type].amount += amountBuy;
    } else {
      acc[type] = {
        category: type,
        amount: amountBuy,
      };
    }
    return acc;
  }, {});

  const chartDataByType = Object.values(categorySums ?? {}).map(
    (category, key) => {
      const pourcentage = (category.amount / totalAmountBuy) * 100;
      return {
        name: category.category,
        amount: category.amount,
        pourcentage,
        fill: `hsl(var(--chart-${key + 1}))`,
      };
    }
  );

  const monthsGraph = getLastMonths(graphMonth, selectNbMonth);

  const montantInvestByMonth = [];
  const dataTransacInvest = dataInvests?.flatMap((investment) =>
    investment.transaction.map((trans) => ({
      title: investment.name,
      amount: trans.type === "buy" && trans.amount,
      date: new Date(trans.date),
    }))
  );

  monthsGraph.forEach(({ code }) => {
    const targetYear = parseInt(code.slice(0, 4));
    const targetMonth = parseInt(code.slice(4, 6));

    const montantInvests = dataTransacInvest
      ?.filter(
        ({ date }) =>
          date.getFullYear() === targetYear &&
          date.getMonth() + 1 === targetMonth
      )
      .reduce((total, { amount }) => total + amount, 0);

    montantInvestByMonth.push(Math.abs(montantInvests));
  });

  const dataGraph = monthsGraph.map((monthData, index) => ({
    month: monthData.month,
    year: monthData.year,
    amount: montantInvestByMonth[index],
  }));

  const defaultConfig = {
    amount: {
      label: "Investissements",
      color: "hsl(var(--graph-invest))",
      visible: true,
    },
    text: {
      color: "hsl(var(--foreground))",
    },
  };

  const firstMonthGraph = monthsGraph[0];
  const lastMonthGraph = monthsGraph[monthsGraph.length - 1];

  const chevronGraphIsVisible = lastMonthGraph.code < currentYearMonth;

  const theMonthGraph = `${firstMonthGraph.month} ${firstMonthGraph.year} - ${lastMonthGraph.month} ${lastMonthGraph.year}`;

  const clickNextMonthGraph = () => {
    let yearNum = parseInt(graphMonth.slice(0, 4), 10);
    let monthNum = parseInt(graphMonth.slice(4), 10);
    monthNum += 1;
    if (monthNum === 13) {
      monthNum = 1;
      yearNum += 1;
    }
    const newMonth = monthNum.toString().padStart(2, "0");
    const newDate = `${yearNum}${newMonth}`;
    setGraphMonth(newDate);
  };

  const clickLastMonthGraph = () => {
    let yearNum = parseInt(graphMonth.slice(0, 4), 10);
    let monthNum = parseInt(graphMonth.slice(4), 10);
    monthNum -= 1;
    if (monthNum === 0) {
      monthNum = 12;
      yearNum -= 1;
    }
    const newMonth = monthNum.toString().padStart(2, "0");
    const newDate = `${yearNum}${newMonth}`;
    setGraphMonth(newDate);
  };

  const maxValue = Math.max(...dataGraph.map((item) => Math.max(item.amount)));
  const formatData = (row) => {
    return [
      row.type,
      row.name,
      isVisible ? formatCurrency.format(row.amount) : "••••",
      isVisible ? formatCurrency.format(row.amountSale) : "••••",
      isVisible ? formatCurrency.format(row.amountSale + row.amount) : "••••",
      isVisible
        ? formatCurrency.format(
            row.transaction
              .filter((t) => t.type === "dividend")
              .reduce((total, t) => total + (t.amount || 0), 0)
          )
        : "••••",
      `${(((row.amountSale + row.amount) / Math.abs(row.amount)) * 100).toFixed(2)}%`,
    ];
  };

  const displayData = dataInvests.map(
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
        transaction,
        date: transaction[0]?.date,
        amount: amountBuy,
        amountSale,
        createdAt,
      };
    }
  );

  const columns = [
    { id: 1, name: "Type", key: "type" },
    { id: 2, name: "Nom", key: "name" },
    { id: 3, name: "Montant acheté", key: "amount" },
    { id: 4, name: "Montant vendu", key: "amountSale" },
    { id: 5, name: "Résultats", key: "amountResult" },
    { id: 6, name: "Dividende", key: "dividend" },
    { id: 7, name: "Rendement", key: "rendement" },
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

  const data = displayData;

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header
          title="Mes Investissements"
          subtitle="Gérez vos investissements"
          isFetching={isFetching}
          navigation={
            <>
              <Dialog modal>
                <DialogTrigger>
                  {dataInvests?.length !== 0 && (
                    <Button>
                      <Plus />
                      <p className="hidden md:block">Nouveau investissement</p>
                    </Button>
                  )}
                </DialogTrigger>
                <DialogContent>
                  <FormAddInvestmentMain refetch={refetch} />
                </DialogContent>
              </Dialog>
            </>
          }
        />
        {dataInvests?.length > 0 ? (
          <div className="flex flex-col w-full justify-center gap-4 animate-fade">
            <div className="flex flex-col lg:flex-row gap-4">
              <BoxInfos
                title="Valeur totale"
                value={Math.abs(amountBuy - amountResult)}
                icon={<Pickaxe size={15} color="grey" />}
                isAmount
                type="investment"
              />
              <BoxInfos
                title="Gains/Pertes"
                value={amountResult}
                icon={<ArrowUp size={15} color="grey" />}
                isAmount
                type="investment"
              />
              <BoxInfos
                title="Mon portefeuille"
                value={dataInvests.length}
                icon={<BookA size={15} color="grey" />}
                onClick={() => navigate(ROUTES.INVESTMENT_ORDER)}
                type="investment"
              />
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              <Container>
                <h2 className="text-left">Graphique</h2>
                <ChartLine
                  data={dataGraph}
                  defaultConfig={defaultConfig}
                  maxValue={maxValue}
                />
                <div
                  className={`flex flex-row w-full md:w-3/4 mx-auto md:px-20 items-center justify-between bottom-2`}
                >
                  <div className="w-1/12">
                    <ChevronLeft
                      size={25}
                      className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                      onClick={clickLastMonthGraph}
                    />
                  </div>
                  <p className="font-thin text-sm w-10/12 italic">
                    {theMonthGraph}
                  </p>
                  <div className="w-1/12">
                    {chevronGraphIsVisible && (
                      <ChevronRight
                        size={25}
                        className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                        onClick={clickNextMonthGraph}
                      />
                    )}
                  </div>
                </div>
                <div className="absolute top-0 right-0 m-2">
                  <Tabs
                    name="selectNbMonth"
                    value={selectNbMonth}
                    onValueChange={(value) => setSelectNbMonth(Number(value))}
                    className="w-full"
                  >
                    <TabsList>
                      <TabsTrigger value={6}>6 mois</TabsTrigger>
                      <TabsTrigger value={12}>1 an</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </Container>
              <div className="lg:w-2/5 flex flex-col gap-4">
                <Container>
                  <h2 className="mb-4 text-left">Statistiques</h2>
                  <div className="h-full flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Dividende perçu</p>
                      <p className="text-xs">
                        {isVisible
                          ? formatCurrency.format(amountDividend)
                          : "••••"}
                      </p>
                    </div>
                  </div>
                </Container>
                <Container>
                  <h2 className="mb-4 text-left">Répartition</h2>
                  <div className="flex flex-col w-full gap-2">
                    {chartDataByType?.map((item, index) => (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="w-full flex justify-between items-end">
                          <p className="text-sm">{item.name}</p>
                          <p className="text-xs">
                            {item.pourcentage.toFixed(0)}%
                          </p>
                        </div>
                        <div className="w-full h-1 bg-primary/20 rounded">
                          <div
                            className="h-full rounded"
                            style={{
                              width: `${item.pourcentage}%`,
                              backgroundColor: item.fill,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
            </div>
            <Container>
              <div className="flex justify-between mb-4">
                <h2 className="text-left">Mes investissements</h2>
              </div>
              <Tableau
                formatData={formatData}
                data={data}
                columns={columns}
                type="investments"
                isFetching={isFetching}
                action={action}
                firstItem={avatar}
                fieldsFilter={[{ key: "type", fieldName: "Type" }]}
              />
            </Container>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">
              Aucun investissement enregistré
            </h2>
            <p className="text-muted-foreground">
              Commencez par ajouter une nouveau investissement pour suivre vos
              paiements et gérer vos finances.
            </p>
            <Dialog modal>
              <DialogTrigger>
                <Button>
                  <Plus />
                  <p className="hidden md:block">Nouveau investissement</p>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <FormAddInvestmentMain refetch={refetch} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </section>
  );
}
