import { useNavigate, useParams } from "react-router-dom";
import { formatDate, formatAmount } from "../../../utils/fonctionnel";
import {
  fetchInvestmentById,
  fetchInvestments,
} from "../../../service/investment.service";
import {
  editInvestments,
  deleteInvestments,
} from "../../../service/investment.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogDelete } from "../../../composant/dialogDelete";
import Header from "../../../composant/header";
import { getInvestmentsByTitle } from "../../../utils/operations";
import { useEffect } from "react";
import Loader from "../../../composant/loader/loader";

export default function Investment() {
  const { data } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const response = await fetchInvestments();

      if (response?.response?.data?.message) {
        const message = response.response.data.message;
        toast.warn(message);
      }

      return response?.data;
    },
    refetchOnMount: true,
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedUpdate, setSelectedUpdate] = useState(false);

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

  const [selectedTitle, setSelectedTitle] = useState(investment?.data?.title);
  const [selectedType, setSelectedType] = useState(investment?.data?.type);
  const [selectedDetail, setSelectedDetail] = useState(
    investment?.data?.detail
  );
  const [selectedDate, setSelectedDate] = useState(investment?.data?.date);
  const [selectedAmount, setSelectedAmount] = useState(
    investment?.data?.amount
  );

  useEffect(() => {
    if (investment) {
      setSelectedTitle(investment?.data?.title);
      setSelectedType(investment?.data?.type);
      setSelectedDetail(investment?.data?.detail);
      setSelectedDate(investment?.data?.date);
      setSelectedAmount(investment?.data?.amount);
    }
  }, [investment]);

  const resetForm = () => {
    setSelectedTitle(investment?.data?.title);
    setSelectedType(investment?.data?.type);
    setSelectedDetail(investment?.data?.detail);
    setSelectedDate(investment?.data?.date);
    setSelectedAmount(investment?.data?.amount);
  };

  const dataBase = [
    investment?.data?.title,
    investment?.data?.type,
    investment?.data?.detail,
    investment?.data?.date,
    investment?.data?.amount,
  ];

  const dataEdit = [
    selectedTitle,
    selectedType,
    selectedDetail,
    selectedDate,
    selectedAmount,
  ];

  const isSaveDisabled = dataBase.every(
    (value, index) => value === dataEdit[index]
  );

  const handleTitle = (event) => {
    setSelectedTitle(event.target.value);
  };

  const handleDetail = (event) => {
    setSelectedDetail(event.target.value);
  };

  const handleMontant = (event) => {
    setSelectedAmount(event.target.value);
  };

  const mutationDelete = useMutation({
    mutationFn: async () => {
      await deleteInvestments(id);
      toast.success("Votre transaction a été supprimée !");
    },
    onSuccess: () => navigate(-1),
  });

  const handleDeleteConfirmation = () => {
    mutationDelete.mutate();
  };

  const mutationEdit = useMutation({
    mutationFn: async () => {
      const editData = {
        id: investment?.data?._id,
        type: selectedType,
        title: selectedTitle,
        date: selectedDate,
        detail: selectedDetail,
        amount: formatAmount(selectedAmount),
      };
      await editInvestments(editData);
      toast.success("L'opération a été modifiée avec succès !");
    },
    onSuccess: () => {
      refetch();
      resetForm();
      setSelectedUpdate(false);
    },
  });

  const handleEditConfirmation = () => {
    mutationEdit.mutate();
  };

  const removeTiret = (number) => {
    if (typeof number === "string") {
      return parseFloat(number.replace(/-/g, ""));
    } else {
      return NaN;
    }
  };

  const suggestions = Array.from(
    new Set(data?.map((investment) => investment.title))
  );

  if (isLoading) return <Loader />;

  if (error)
    return <div>Erreur lors de la récupération de la transaction.</div>;

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
            <div className="h-40 w-full  bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
              {selectedUpdate ? (
                <>
                  <Input
                    className="h-full w-full bg-transparent text-center text-4xl  rounded-2xl"
                    value={selectedTitle}
                    type="text"
                    list="title-suggestions"
                    name=""
                    onChange={(e) => {
                      handleTitle(e);
                      handleInputChange();
                    }}
                    placeholder="Titre"
                  />
                  <datalist id="title-suggestions">
                    {suggestions.map((suggestion, index) => (
                      <option key={index} value={suggestion} />
                    ))}
                  </datalist>
                </>
              ) : (
                <h2 className="text-4xl">{investment?.data?.title}</h2>
              )}
            </div>

            <div className="flex flex-row gap-4">
              <div className="h-40 w-full  bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
                {selectedUpdate ? (
                  <Select
                    value={selectedType}
                    onValueChange={(value) => {
                      setSelectedType(value);
                      handleInputChange();
                    }}
                    required
                  >
                    <SelectTrigger className="w-full h-40 px-2 text-4xl bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex items-center justify-center">
                      <SelectValue placeholder="Entrez le type" />
                    </SelectTrigger>
                    <SelectContent className="bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl">
                      <SelectItem className="rounded-xl" value="Action">
                        Action
                      </SelectItem>
                      <SelectItem className="rounded-xl" value="ETF">
                        ETF
                      </SelectItem>
                      <SelectItem className="rounded-xl" value="Crypto">
                        Crypto
                      </SelectItem>
                      <SelectItem className="rounded-xl" value="Obligation">
                        Obligation
                      </SelectItem>
                      <SelectItem className="rounded-xl" value="Dérivé">
                        Dérivé
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <h2 className="text-4xl">{investment?.data?.type}</h2>
                )}
              </div>
            </div>
            <div className="flex flex-row w-full gap-4">
              <div className="h-40 w-full bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
                {selectedUpdate ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full h-40 px-40 text-4xl bg-colorSecondaryLight dark:bg-colorPrimaryDark text-center rounded-2xl"
                      >
                        {selectedDate ? (
                          format(new Date(selectedDate), "PPP", {
                            locale: fr,
                          })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-6 w-6 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto bg-colorSecondaryLight dark:bg-[#1a1a1a] rounded-2xl p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={new Date(selectedDate)}
                        onSelect={(date) => {
                          if (date) {
                            const newDate = new Date(date);
                            newDate.setUTCHours(0, 0, 0, 0);
                            newDate.setUTCFullYear(date.getFullYear());
                            newDate.setUTCMonth(date.getMonth());
                            newDate.setUTCDate(date.getDate());
                            setSelectedDate(newDate);
                          }
                          handleInputChange();
                        }}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <h2 className="text-4xl">
                    {formatDate(investment?.data?.date, 2)}
                  </h2>
                )}
              </div>
              <div className="h-40 w-full  bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
                {selectedUpdate ? (
                  <Input
                    className="h-full w-full px-40 bg-transparent text-center text-4xl rounded-2xl"
                    value={removeTiret(selectedAmount)}
                    type="number"
                    step="0.5"
                    min="0"
                    onChange={(e) => {
                      handleMontant(e);
                      handleInputChange();
                    }}
                    placeholder="Montant"
                  />
                ) : (
                  <h2 className="text-4xl">{investment?.data?.amount} €</h2>
                )}
              </div>
            </div>
            <div className="h-40 w-full bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
              {selectedUpdate ? (
                <Textarea
                  className="h-full w-full bg-transparent text-center text-xl p-4 rounded-2xl"
                  value={selectedDetail}
                  name=""
                  onChange={(e) => {
                    handleDetail(e);
                    handleInputChange();
                  }}
                  placeholder="Détails"
                />
              ) : (
                <h2 className="text-xl">
                  {investment?.data?.detail
                    ? investment?.data?.detail
                    : "Aucun détail ajouté"}
                </h2>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between items-center w-1/4 gap-4">
            <div className="flex flex-col w-full gap-4">
              <div className="p-8 h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex justify-center items-center">
                <p>
                  Ajouter le : <br />
                  <b>{formatDate(investment?.data?.createdAt, 1)}</b>
                </p>
              </div>
              <div className="p-8 h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex justify-center items-center">
                <p>
                  Derniere modification le : <br />
                  <b>{formatDate(investment?.data?.updatedAt, 1)}</b>
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

            <div className="flex flex-col gap-4 w-full">
              {selectedUpdate && !isSaveDisabled ? (
                <div className="flex flex-col gap-4 justify-center items-center">
                  <p className="text-sm">Êtes-vous sûr de vouloir modifier ?</p>
                  <div className="flex gap-4">
                    <div
                      className="p-8 border-2 border-red-900 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95"
                      onClick={() => handleEditConfirmation()}
                    >
                      Oui
                    </div>
                    <div
                      className="p-8 border-2 border-zinc-900 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95 hover:border-green-900"
                      onClick={() => {
                        setSelectedUpdate(false);
                        setUpdate(false);
                        resetForm();
                      }}
                    >
                      Non
                    </div>
                  </div>
                </div>
              ) : selectedUpdate ? (
                <div
                  className="p-8 h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex justify-center items-center hover:bg-opacity-80 cursor-pointer transition-all hover:scale-95"
                  onClick={() => setSelectedUpdate(false)}
                >
                  Annuler
                </div>
              ) : (
                <div
                  className="p-8 h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex justify-center items-center hover:bg-opacity-80 cursor-pointer transition-all hover:scale-95"
                  onClick={() => setSelectedUpdate(true)}
                >
                  Modifier
                </div>
              )}
              <div className="flex flex-col gap-4 justify-center items-center">
                <DialogDelete
                  btnDelete={
                    <div className="w-full p-8 h-32 border-2 border-red-900 bg-colorSecondaryLight dark:bg-colorPrimaryDark  rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95">
                      Supprimer
                    </div>
                  }
                  handleDelete={handleDeleteConfirmation}
                  isPending={mutationDelete.isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
