import { useNavigate, useParams } from "react-router-dom";
import {
  convertDateHour,
  formatDate,
  separateMillier,
} from "../../../utils/fonctionnel";
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
import { useMutation, useQuery } from "@tanstack/react-query"; // Added missing useQuery
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogDelete } from "../../../composant/dialogDelete";
import Header from "../../../composant/header";
import { getInvestmentsByTitle } from "../../../utils/operations";
import { useEffect } from "react";
import Loader from "../../../composant/loader";

export default function Investment() {
  const userId = localStorage.getItem("userId");
  const { data } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const response = await fetchInvestments(userId);

      if (response?.response?.data?.message) {
        const message = response.response.data.message;
        toast.warn(message);
      }

      return response?.data;
    },
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedUpdate, setSelectedUpdate] = useState(false);
  const [update, setUpdate] = useState(false);

  // Fetch the investment details by ID
  const {
    data: investment,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fetchInvestmentById", id],
    queryFn: () => fetchInvestmentById(id),
    enabled: !!id,
  });

  // Initialize states only when investment data is available
  const [selectedTitle, setSelectedTitle] = useState(investment?.data?.title);
  const [selectedType, setSelectedType] = useState(investment?.data?.type);
  const [selectedDetail, setSelectedDetail] = useState(
    investment?.data?.detail
  );
  const [selectedDate, setSelectedDate] = useState(investment?.data?.date);
  const [selectedMontant, setSelectedMontant] = useState(
    investment?.data?.amount
  );

  useEffect(() => {
    if (investment) {
      setSelectedTitle(investment?.data?.title);
      setSelectedDetail(investment?.data?.detail);
      setSelectedMontant(investment?.data?.amount);
      setSelectedType(investment?.data?.type);
      setSelectedDate(investment?.data?.date);
    }
  }, [investment]); // Réagir

  const resetForm = () => {
    setSelectedType(investment?.data?.type);
    setSelectedTitle(investment?.data?.title);
    setSelectedDetail(investment?.data?.detail);
    setSelectedDate(investment?.data?.date);
    setSelectedMontant(investment?.data?.amount);
  };

  const handleTitle = (event) => {
    setSelectedTitle(event.target.value);
  };

  const handleDetail = (event) => {
    setSelectedDetail(event.target.value);
  };

  const handleMontant = (event) => {
    setSelectedMontant(event.target.value);
  };

  const handleInputChange = () => setUpdate(true);

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
        amount: separateMillier(selectedMontant),
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
      console.error("Invalid input, expected a string:", number);
      return NaN;
    }
  };

  const suggestions = Array.from(
    new Set(data?.map((investment) => investment.title))
  );

  // Affichez un écran de chargement pendant que vous vérifiez l'authentification
  if (isLoading) {
    return <Loader />;
  }
  if (error)
    return <div>Erreur lors de la récupération de la transaction.</div>;

  return (
    <section className="w-full">
      <Header
        title={investment?.data?.title}
        typeProps="investment"
        btnAdd
        btnReturn
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
                      setSelectedType(value); // Update the selected category
                      handleInputChange(); // Call your input change handler if necessary
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
                    {formatDate(investment?.data?.date)}
                  </h2>
                )}
              </div>
              <div className="h-40 w-full  bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
                {selectedUpdate ? (
                  <Input
                    className="h-full w-full px-40 bg-transparent text-center text-4xl rounded-2xl"
                    value={removeTiret(selectedMontant)}
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
                  <b>{convertDateHour(investment?.data?.createdAt)}</b>
                </p>
              </div>
              <div className="p-8 h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex justify-center items-center">
                <p>
                  Derniere modification le : <br />
                  <b>{convertDateHour(investment?.data?.updatedAt)}</b>
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
              {selectedUpdate && update === true ? (
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
