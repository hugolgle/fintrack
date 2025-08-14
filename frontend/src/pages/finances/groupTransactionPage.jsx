import React from "react";
import Header from "../../components/headers";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormAddGroup } from "./formAddGroup";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchGroupTransactions } from "../../services/groupTransaction.service";
import { HttpStatusCode } from "axios";
import SkeletonDashboard from "../../components/skeletonBoard";
import { ROUTES } from "../../components/route";
import { useNavigate } from "react-router";
import { formatCurrency } from "../../utils/fonctionnel";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Container from "../../components/containers/container";
import { useAmountVisibility } from "../../context/AmountVisibilityContext";

function GroupTransactionPage() {
  const { isVisible } = useAmountVisibility();
  const navigate = useNavigate();
  const {
    isLoading,
    data: dataGroupTransactions,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["fetchGroupTransactions"],
    queryFn: async () => {
      const response = await fetchGroupTransactions();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });
  if (isLoading) return <SkeletonDashboard />;

  return (
    <section className="w-full">
      <Header
        title="Mes Groupes"
        isFetching={isFetching}
        navigation={
          <>
            <Dialog modal>
              <DialogTrigger>
                <Button>
                  <Plus />
                  <p className="hidden md:block">Nouveau groupe</p>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <FormAddGroup refetch={refetch} />
              </DialogContent>
            </Dialog>
          </>
        }
      />
      <div className="flex flex-wrap gap-4 !w-1/2 mx-auto">
        {dataGroupTransactions?.map((group) => {
          return (
            group?._id && (
              <Container
                key={group._id}
                custom="cursor-pointer hover:ring-muted-foreground transition group"
                onClick={() => {
                  navigate(
                    ROUTES.GROUP_TRANSACTION_BY_ID.replace(":id", group._id)
                  );
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {group.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                        <span className="text-xs flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(group.createdAt, "PP", { locale: fr })},
                        </span>
                        <span className="text-xs">
                          {group.transactions.length} transaction
                          {group.transactions.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {isVisible
                          ? formatCurrency.format(
                              (group.transactions || []).reduce(
                                (sum, t) => sum + Number(t.amount || 0),
                                0
                              )
                            )
                          : "••••"}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Container>
            )
          );
        })}
      </div>
    </section>
  );
}

export default GroupTransactionPage;
