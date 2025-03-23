import { ArrowUpRight, DollarSign, Home, Wallet } from "lucide-react";
import Header from "../../components/Header";
import BoxInfos from "../../components/Box/BoxInfos";
import { CreditCardComponent } from "../../components/CreditComponent/CardCredit";
import { useEffect, useState } from "react";
import { CreditSummary } from "../../components/CreditComponent/CreditSummary";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PaymentHistory } from "../../components/CreditComponent/paymentHistory";
import { FormCredit } from "./FormCredit";
import { fetchCredits } from "../../Service/Credit.service";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader/Loader";
import { HttpStatusCode } from "axios";
import { toast } from "sonner";
import Container from "../../components/Container/Container";

export default function Credit() {
  const {
    isLoading,
    data: credits,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["fetchCredits"],
    queryFn: async () => {
      const response = await fetchCredits();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data || [];
    },
    refetchOnMount: true,
  });

  const amountDette = credits?.reduce(
    (acc, credit) => acc + (Number(credit.balance) || 0),
    0
  );

  const amountMonthly = credits?.reduce(
    (acc, credit) => acc + (Number(credit.monthlyPayment) || 0),
    0
  );

  const interestRateAverage = credits?.reduce(
    (acc, credit) => acc + (Number(credit.interestRate) || 0),
    0
  );

  const [activeCredit, setActiveCredit] = useState(null);

  useEffect(() => {
    if (credits && credits.length > 0) {
      setActiveCredit(credits[0]);
    }
  }, [credits]);

  if (isLoading) return <Loader />;

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header
          title="Crédit"
          modalAdd={<FormCredit refetch={refetch} />}
          isFetching={isFetching}
        />

        <div className="flex flex-col gap-4 w-full animate-fade">
          <div className="flex w-full gap-4">
            {credits.length > 0 && (
              <>
                <BoxInfos
                  title="Dette Totale"
                  value={amountDette}
                  isAmount
                  description={`Répartie sur ${credits.length} crédit(s)`}
                  icon={<DollarSign size={15} color="grey" />}
                />
                <BoxInfos
                  title="Mensualités Totales"
                  value={amountMonthly}
                  isAmount
                  description="Par mois"
                  icon={<ArrowUpRight size={15} color="grey" />}
                />
                <BoxInfos
                  title="Taux moyens"
                  isPercent
                  value={(interestRateAverage / credits.length).toFixed(2)}
                  description="Tous crédits confondus"
                  icon={<Wallet size={15} color="grey" />}
                />
              </>
            )}
          </div>

          {/* Liste des crédits */}
          <div className="flex gap-4 w-full">
            <div className="w-1/3 flex flex-col gap-4">
              {credits &&
                credits.map((credit) => (
                  <CreditCardComponent
                    key={credit._id}
                    credit={credit}
                    isActive={activeCredit?._id === credit._id}
                    onClick={() => setActiveCredit(credit)}
                    refetch={refetch}
                  />
                ))}
            </div>

            {/* Détails du crédit sélectionné */}
            <Container custom="w-2/3 h-fit">
              {activeCredit ? (
                <Tabs defaultValue="summary">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="summary">Résumé</TabsTrigger>
                    <TabsTrigger value="history">Historique</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary">
                    <CreditSummary credit={activeCredit} />
                  </TabsContent>

                  <TabsContent value="history">
                    <PaymentHistory credit={activeCredit} />
                  </TabsContent>
                </Tabs>
              ) : (
                <p className="text-center text-muted-foreground">
                  Sélectionnez un crédit pour en voir les détails.
                </p>
              )}
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
}
