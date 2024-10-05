import { useNavigate, useParams } from "react-router-dom";

import {
  convertDateHour,
  formatDate,
  separateMillier,
} from "../../../utils/fonctionnel";
import { getInvestmentById } from "../../../utils/operations";
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
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteInvestments,
  editInvestments,
  getInvestments,
  soldInvestments,
} from "../../../redux/actions/investment.action";
import MainLayout from "../../../layout/mainLayout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogDelete } from "../../../composant/dialogDelete";

export default function Investment() {
  const { id } = useParams();
  const investment = getInvestmentById(id);

  const [selectedDelete, setSelectedDelete] = useState(false);

  const [selectedUpdate, setSelectedUpdate] = useState(false);

  const [selectedVendre, setSelectedVendre] = useState(false);

  const [update, setUpdate] = useState(false);

  const [selectedType, setSelectedType] = useState(investment.type);

  const [selectedTitre, setSelectedTitre] = useState(investment.titre);

  const [selectedDetail, setSelectedDetail] = useState(investment.detail);

  const [selectedDate, setSelectedDate] = useState(investment.date);

  const [selectedMontant, setSelectedMontant] = useState(investment.montant);

  const [selectedMontantVendu, setSelectedMontantVendu] = useState(
    investment.montant
  );

  const resetForm = () => {
    setSelectedType(investment.type);
    setSelectedTitre(investment.titre);
    setSelectedDetail(investment.detail);
    setSelectedDate(investment.date);
    setSelectedMontant(investment.montant);
  };

  const handleTitre = (event) => {
    setSelectedTitre(event.target.value);
  };

  const handleDate = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleDetail = (event) => {
    setSelectedDetail(event.target.value);
  };

  const handleMontant = (event) => {
    setSelectedMontant(event.target.value);
  };

  const handleMontantVendu = (event) => {
    setSelectedMontantVendu(event.target.value);
  };

  const handleInputChange = () => {
    setUpdate(true);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteConfirmation = async () => {
    await dispatch(deleteInvestments(id));
    navigate(-1);
    dispatch(getInvestments());
    toast.success("L'opération a été supprimé avec succès !");
  };

  function removeTiret(number) {
    return parseFloat(number.replace(/-/g, ""));
  }

  const handleEditConfirmation = async () => {
    const editData = {
      id: investment._id,
      type: selectedType,
      titre: selectedTitre,
      date: selectedDate,
      detail: selectedDetail,
      montant: separateMillier(selectedMontant),
    };
    await dispatch(editInvestments(editData));
    toast.success("L'opération a été modifié avec succès !");
    dispatch(getInvestments());
    setSelectedUpdate(false);
  };

  const handleSoldConfirmation = async () => {
    await dispatch(soldInvestments(investment._id, selectedMontantVendu));
    toast.success("L'investissement a été vendu avec succès !", "bg-grenn-500");
    dispatch(getInvestments());
    setSelectedUpdate(false);
  };

  return (
    <>
      <MainLayout
        title={investment.titre}
        typeProps="invest"
        btnAdd
        btnReturn
      />
      <section className="flex flex-col gap-4 ">
        <div className="flex flex-row gap-4 animate-fade">
          <div className="flex flex-col gap-4 w-3/4">
            <div className="h-40 w-full  bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
              {selectedUpdate ? (
                <Input
                  className="h-full w-full bg-transparent text-center text-4xl  rounded-2xl"
                  value={selectedTitre}
                  type="text"
                  name=""
                  onChange={(e) => {
                    handleTitre(e);
                    handleInputChange();
                  }}
                  placeholder="Type"
                />
              ) : (
                <h2 className="text-4xl">{investment.titre}</h2>
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
                      <SelectValue placeholder="Entrez la catégorie" />
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
                  <h2 className="text-4xl">{investment.type}</h2>
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
                          format(new Date(selectedDate), "PPP", { locale: fr })
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
                  <h2 className="text-4xl">{formatDate(investment.date)}</h2>
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
                  <h2 className="text-4xl">{investment.montant} €</h2>
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
                  {investment.detail
                    ? investment.detail
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
                  <b>{convertDateHour(investment.createdAt)}</b>
                </p>
              </div>
              <div className="p-8 h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex justify-center items-center">
                <p>
                  Derniere modification le : <br />
                  <b>{convertDateHour(investment.updatedAt)}</b>
                </p>
              </div>
            </div>
            {!investment.isSold && (
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
            )}

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
      </section>
    </>
  );
}
