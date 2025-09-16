import {
  ArrowUpRight,
  DollarSign,
  Home,
  Plus,
  Wallet,
  Wallet2,
} from "lucide-react";
import Header from "../../components/headers";
import BoxInfos from "../../components/boxs/boxInfos";
import { CreditCardComponent } from "../../components/creditComponents/cardCredit";
import { useEffect, useState } from "react";
import { CreditSummary } from "../../components/creditComponents/creditSummary";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PaymentHistory } from "../../components/creditComponents/paymentHistory";
import { FormCredit } from "./formCredit";
import { deletePayment, fetchCredits } from "../../services/credit.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { toast } from "sonner";
import Container from "../../components/containers/container";
import Loader from "../../components/loaders/loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SkeletonDashboard from "../../components/skeletonBoard";

export default function Credit() {
  const queryClient = useQueryClient();
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

  const mutationDelete = useMutation({
    mutationFn: async ({ creditId, paymentId }) => {
      return await deletePayment(creditId, paymentId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["fetchCredits"],
      });
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
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
    if (!credits || credits.length === 0) return;
    const found = credits?.find((c) => c._id === activeCredit?._id);
    setActiveCredit(found ?? credits[0]);
  }, [credits]);

  if (isLoading) return <SkeletonDashboard />;

  return (
    <main>
      <div className="flex flex-col">
        <Header
          title="Mes Crédits"
          subtitle="Gérez vos crédits et suivez vos paiements"
          isFetching={isFetching}
          navigation={
            <Dialog modal>
              <DialogTrigger>
                {credits?.length < 0 && (
                  <Button>
                    <Plus />
                    <p className="hidden md:block">Nouveau crédit</p>
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent>
                <FormCredit refetch={refetch} />
              </DialogContent>
            </Dialog>
          }
        />
        {credits.length > 0 ? (
          <div className="flex flex-col gap-4 w-full animate-fade">
            <div className="flex flex-col lg:flex-row w-full gap-4">
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
            </div>

            {/* Liste des crédits */}
            <div className="flex flex-col lg:flex-row gap-4 w-full">
              <div className="lg:w-1/3 flex flex-col gap-4">
                {credits?.map((credit) => (
                  <CreditCardComponent
                    key={credit._id}
                    credit={credit}
                    isActive={activeCredit?._id === credit._id}
                    onClick={() => setActiveCredit(credit)}
                    refetch={refetch}
                  />
                ))}
              </div>

              <Container custom="w-2/3 h-fit">
                <Tabs defaultValue="summary">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="summary">Résumé</TabsTrigger>
                    <TabsTrigger value="history">Historique</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary">
                    <CreditSummary credit={activeCredit} />
                  </TabsContent>

                  <TabsContent value="history">
                    <PaymentHistory
                      credit={activeCredit}
                      mutationDelete={mutationDelete.mutate}
                    />
                  </TabsContent>
                </Tabs>
              </Container>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Aucun crédit enregistré</h2>
            <p className="text-muted-foreground">
              Commencez par ajouter un nouveau crédit pour suivre vos paiements
              et gérer vos finances.
            </p>
            <Dialog modal>
              <DialogTrigger>
                <Button>
                  <Plus />
                  <p className="hidden md:block">Nouveau crédit</p>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <FormCredit refetch={refetch} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </main>
  );
}
