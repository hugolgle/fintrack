import { Link, useNavigate, useParams } from "react-router-dom";

import {
  addSpace,
  convertDateHour,
  convertirFormatDate,
  formatDate,
  formatMontant,
  separateMillier,
} from "../../../utils/fonctionnel";
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
  getTitleOfTransactionsByType,
  getTransactionById,
} from "../../../utils/operations";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  categorieRecette,
  categorieDepense,
} from "../../../../public/categories.json";
import { Input } from "@/components/ui/input";

import {
  deleteTransactions,
  editTransactions,
  getTransactions,
} from "../../../redux/actions/transaction.action";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { categorieSort } from "../../../utils/other";
import MainLayout from "../../../layout/mainLayout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogDelete } from "../../../composant/dialogDelete";
import Header from "../../../composant/header";

export default function Transaction() {
  const categorieD = categorieSort(categorieDepense);
  const categorieR = categorieSort(categorieRecette);

  const { id } = useParams();
  const transaction = getTransactionById(id);

  const suggestions = getTitleOfTransactionsByType(transaction.type);

  const [selectedDelete, setSelectedDelete] = useState(false);

  const [selectedUpdate, setSelectedUpdate] = useState(false);

  const [update, setUpdate] = useState(false);

  const [selectedTitre, setSelectedTitre] = useState(transaction.titre);

  const [selectedCategorie, setSelectedCategorie] = useState(
    transaction.categorie
  );

  const [selectedDate, setSelectedDate] = useState(transaction.date);

  const [selectedDetail, setSelectedDetail] = useState(transaction.detail);

  const [selectedMontant, setSelectedMontant] = useState(transaction.montant);

  const resetForm = () => {
    setSelectedTitre(transaction.titre);
    setSelectedDetail(transaction.detail);
    setSelectedMontant(transaction.montant);
    setSelectedCategorie(transaction.categorie);
    setSelectedDate(transaction.date);
  };

  const handleTitre = (event) => {
    setSelectedTitre(event.target.value);
  };

  const handleDetail = (event) => {
    setSelectedDetail(event.target.value);
  };

  const handleMontant = (event) => {
    setSelectedMontant(event.target.value);
  };

  const handleInputChange = () => {
    setUpdate(true);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteConfirmation = async () => {
    await dispatch(deleteTransactions(id));
    navigate(-1);
    dispatch(getTransactions());
    toast.success("Votre transaction a été supprimé !");
  };

  function removeTiret(number) {
    if (typeof number === "string") {
      return parseFloat(number.replace(/-/g, ""));
    } else {
      console.error("Invalid input, expected a string:", number);
      return NaN;
    }
  }

  const handleEditConfirmation = async () => {
    const editData = {
      id: transaction._id,
      type: transaction.type,
      titre: selectedTitre,
      categorie: selectedCategorie,
      date: selectedDate,
      detail: selectedDetail,
      montant: formatMontant(removeTiret(selectedMontant), transaction.type),
    };
    await dispatch(editTransactions(editData));
    dispatch(getTransactions());
    setSelectedUpdate(false);
    toast.success("L'opération a été modifié avec succès !");
  };

  const typeProps =
    transaction.type === "Dépense"
      ? "depense"
      : transaction.type === "Recette"
        ? "recette"
        : undefined;

  return (
    <section className="w-full">
      <Header
        title={transaction.titre}
        typeProps={typeProps}
        categories={transaction.type === "Dépense" ? categorieD : categorieR}
        btnAdd
        btnReturn
      />

      <div className="flex flex-row gap-4">
        <div className="flex flex-col w-3/4 gap-4 animate-fade">
          <div className="h-40 w-full  bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
            {selectedUpdate ? (
              <>
                <Input
                  className="text-4xl rounded-2xl text-center h-full font-thin bg-transparent"
                  list="title-suggestions"
                  id="title"
                  name="title"
                  maxLength={50}
                  placeholder="Titre"
                  value={selectedTitre}
                  onChange={(e) => {
                    handleTitre(e);
                    handleInputChange();
                  }}
                  required
                />
                <datalist id="title-suggestions">
                  {suggestions.map((suggestion, index) => (
                    <option key={index} value={suggestion} />
                  ))}
                </datalist>
              </>
            ) : (
              <h2 className="text-4xl">{transaction.titre}</h2>
            )}
          </div>
          <div className="flex flex-row gap-4">
            <div className="h-40 w-full  bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
              {selectedUpdate ? (
                <Select
                  value={selectedCategorie}
                  onValueChange={(value) => {
                    setSelectedCategorie(value); // Update the selected category
                    handleInputChange(); // Call your input change handler if necessary
                  }}
                  required
                >
                  <SelectTrigger className="w-full h-40 px-2 text-4xl bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex items-center justify-center">
                    <SelectValue placeholder="Entrez la catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl">
                    {transaction.type === "Dépense" &&
                      categorieD.map(({ name }) => (
                        <SelectItem
                          key={name}
                          value={name}
                          className="rounded-xl"
                        >
                          {name}
                        </SelectItem>
                      ))}
                    {transaction.type === "Recette" &&
                      categorieR.map(({ name }) => (
                        <SelectItem
                          key={name}
                          value={name}
                          className="rounded-xl"
                        >
                          {name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <h2 className="text-4xl">{transaction.categorie}</h2>
              )}
            </div>

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
                      selected={
                        selectedDate ? new Date(selectedDate) : undefined
                      }
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
                <h2 className="text-4xl">{formatDate(transaction.date)}</h2>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="min-h-40 w-full bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
              {selectedUpdate ? (
                <Input
                  className="h-full w-full px-80  bg-transparent text-center text-4xl  rounded-2xl"
                  value={removeTiret(selectedMontant)}
                  type="number"
                  step="0.5"
                  min="0"
                  name=""
                  onChange={(e) => {
                    handleMontant(e);
                    handleInputChange();
                  }}
                  placeholder="Montant"
                />
              ) : (
                <div className="flex flex-col">
                  <h2 className="text-4xl">
                    {addSpace(parseFloat(transaction.montant).toFixed(2))} €
                  </h2>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-4">
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
                  {transaction.detail
                    ? transaction.detail
                    : "Aucun détail ajouté"}
                </h2>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/4 justify-between">
          <div className="flex flex-col gap-4">
            <div className="p-8 h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex justify-center items-center">
              <p>
                Ajouter le : <br />
                <b>{convertDateHour(transaction.createdAt)}</b>
              </p>
            </div>
            {transaction.updatedAt !== transaction.createdAt && (
              <div className="p-8 h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex justify-center items-center">
                <p>
                  Dernière modification le : <br />
                  <b>{convertDateHour(transaction.updatedAt)}</b>
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
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
  );
}
