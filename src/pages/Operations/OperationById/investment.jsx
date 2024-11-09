import { useNavigate, useParams } from "react-router-dom";
import {
  fetchInvestmentById,
  fetchInvestments,
} from "../../../service/investment.service";
import { deleteInvestments } from "../../../service/investment.service";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { DialogDelete } from "../../../composant/dialogDelete";
import Header from "../../../composant/header";
import Loader from "../../../composant/loader/loader";
import { useTheme } from "../../../context/ThemeContext";
import { HttpStatusCode } from "axios";
import { DialogEditInvest } from "../../../composant/dialogEditInvest";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Investment() {
  const { data } = useQuery({
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
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: investment,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["fetchInvestmentById", id],
    queryFn: () => fetchInvestmentById(id),
    enabled: !!id,
    refetchOnMount: true,
  });

  const mutationDelete = useMutation({
    mutationFn: async () => {
      return await deleteInvestments(id);
    },
    onSuccess: (response) => {
      navigate(-1);
      toast.success(response?.data?.message);
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const handleDeleteConfirmation = () => {
    mutationDelete.mutate();
  };

  if (isLoading) return <Loader />;

  if (error)
    return <div>Erreur lors de la récupération de la investissement.</div>;

  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";

  return (
    <section className="w-full">
      <Header
        title={investment?.data?.title}
        typeProps="investment"
        btnAdd
        btnReturn
        isFetching={isFetching}
      />
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-row gap-4 animate-fade">
          <div className="flex flex-col gap-4 w-3/4">
            <div className="flex flex-row gap-4">
              <div
                className={`h-40 w-full  ${bgColor} flex justify-center items-center rounded-2xl`}
              >
                <h2 className="text-4xl">{investment?.data?.type}</h2>
              </div>
            </div>
            <div className="flex flex-row w-full gap-4">
              <div
                className={`h-40 w-full ${bgColor} overflow-hidden flex justify-center items-center rounded-2xl`}
              >
                <h2 className="text-4xl">
                  {format(investment?.data?.date, "d MMMM yyyy", {
                    locale: fr,
                  })}
                </h2>
              </div>
              <div
                className={`h-40 w-full overflow-hidden ${bgColor} flex justify-center items-center rounded-2xl`}
              >
                <h2 className="text-4xl">{investment?.data?.amount} €</h2>
              </div>
            </div>
            {investment?.data?.detail && (
              <div
                className={`h-40 w-full ${bgColor} flex justify-center items-center rounded-2xl overflow-hidden`}
              >
                <h2 className="text-xl">{investment?.data?.detail}</h2>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between items-center w-1/4 gap-4">
            <div className="flex flex-col w-full gap-4">
              <div
                className={`p-8 h-32 ${bgColor} rounded-2xl flex justify-center items-center`}
              >
                <p>
                  Ajouter le : <br />
                  <b>
                    {format(investment?.data?.createdAt, "dd/MM/yyyy à HH:mm")}
                  </b>
                </p>
              </div>
              <div
                className={`p-8 h-32 ${bgColor} rounded-2xl flex justify-center items-center`}
              >
                <p>
                  Modifié le : <br />
                  <b>
                    {format(investment?.data?.updatedAt, "dd/MM/yyyy à HH:mm")}
                  </b>
                </p>
              </div>
            </div>
            {/* {!investment?.data?.isSold && (
              <>
                <div className="flex flex-col w-full gap-4 justify-center items-center">
                  {selectedVendre ? (
                    <div className="flex flex-col gap-4 w-full justify-center items-center">
                      <p className="text-sm">Montant de la vente :</p>
                      <Input
                        className="rounded px-1"
                        value={selectedMontantVendu}
                        type="number"
                        step="0.5"
                        min="0"
                        name=""
                        onChange={(e) => {
                          handleMontantVendu(e);
                          handleInputChange();
                        }}
                      />
                      <div className="w-full flex flex-row gap-4">
                        <Button
                          variant="outline"
                          className="rounded-xl w-full"
                          onClick={() => setSelectedVendre(false)}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-xl w-full"
                          onClick={() => handleSoldConfirmation()}
                        >
                          Vendre
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="rounded-xl w-36"
                      onClick={() => setSelectedVendre(true)}
                    >
                      Vendre
                    </Button>
                  )}
                </div>
              </>
            )} */}

            <div className="flex justify-center gap-4 w-full">
              <DialogEditInvest
                investment={investment}
                refetch={refetch}
                data={data}
              />

              <DialogDelete
                handleDelete={handleDeleteConfirmation}
                isPending={mutationDelete.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
