"use client";

import { Button } from "../../../@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  categorieRecette,
  categorieDepense,
} from "../../../public/categories.json";
import { Path, formatMontant, getCurrentDate } from "../../utils/fonctionnel";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addTransactions,
  getTransactions,
} from "../../redux/actions/transaction.action";
import { infoUser } from "../../utils/users";
import { categorieSort } from "../../utils/other";
import BtnReturn from "../../components/Button/btnReturn";
import {
  getLatestTransactionByTitle,
  getTitleOfTransactionsByType,
} from "../../utils/operations";
import Title from "../../components/Text/title";
import CardMessage from "../../components/cardMessage";

export default function PageAddTransac(props: any) {
  const userInfo = infoUser();
  const location = useLocation();
  const lUrl = Path(location, 1);

  const categorieD = categorieSort(categorieDepense);
  const categorieR = categorieSort(categorieRecette);

  const suggestions = getTitleOfTransactionsByType(props.type);

  const [selectedTitre, setSelectedTitre] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [selectedDate, setSelectedDate] = useState(getCurrentDate);
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedMontant, setSelectedMontant] = useState("");
  const [addedOperationDate, setAddedOperationDate] = useState("");
  const [addedOperationId, setAddedOperationId] = useState("");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");

  const dispatch = useDispatch();

  const lastTransacByTitle = getLatestTransactionByTitle(
    selectedTitre,
    props.type
  );

  useEffect(() => {
    if (selectedTitre && lastTransacByTitle) {
      setSelectedCategorie(lastTransacByTitle.categorie || "");
      setSelectedDate(getCurrentDate);
      setSelectedDetail(lastTransacByTitle.detail || "");
      setSelectedMontant(
        Math.abs(parseFloat(lastTransacByTitle.montant)).toFixed(2) || ""
      );
    } else {
      setSelectedCategorie("");
      setSelectedDate(getCurrentDate);
      setSelectedDetail("");
      setSelectedMontant("");
    }
  }, [selectedTitre, lastTransacByTitle]);

  const handleInputChange = () => {
    setMessage("");
    setMessageError("");
    setAddedOperationDate("");
    setAddedOperationId("");
  };

  const resetForm = () => {
    setSelectedTitre("");
    setSelectedCategorie("");
    setSelectedDetail("");
    setSelectedMontant("");
  };

  const handleCategorie = (event: any) => {
    setSelectedCategorie(event.target.value);
  };

  const handleDateChange = (event: any) => {
    setSelectedDate(event.target.value);
  };

  const handleDetail = (event: any) => {
    setSelectedDetail(event.target.value);
  };

  const handleTitre = (event: any) => {
    setSelectedTitre(event.target.value);
  };

  const handleMontant = (event: any) => {
    setSelectedMontant(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const postData = {
      user: userInfo.id,
      type: props.type,
      categorie: selectedCategorie,
      titre: selectedTitre,
      date: selectedDate,
      detail: selectedDetail,
      montant: formatMontant(selectedMontant, props.type),
    };

    try {
      const response = await dispatch(addTransactions(postData) as any);
      const newOperationId = response.data._id;
      setAddedOperationId(newOperationId);
      dispatch(getTransactions() as any);
      resetForm();

      const transactionDate = new Date(selectedDate);
      const formattedDate = `${transactionDate.getFullYear()}${(transactionDate.getMonth() + 1).toString().padStart(2, "0")}`;
      setAddedOperationDate(formattedDate);
      setMessage(`Votre ${props.type.toLowerCase()} a été ajouté ! `);
    } catch {
      setMessageError(
        "Une erreur s'est produite lors de l'ajout de l'opération"
      );
    }
  };

  return (
    <>
      <section className="h-full">
        <Title title={`Ajouter une ${props.type.toLowerCase()}`} />

        <div className="absolute top-4 left-4">
          <BtnReturn />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5 px-36 py-10"
        >
          <input
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
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
            {suggestions.map((suggestion: any, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>

          <select
            id="action"
            value={selectedCategorie}
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
            onChange={(e) => {
              handleCategorie(e);
              handleInputChange();
            }}
            required
          >
            <option disabled selected value="">
              Entrez la catégorie
            </option>
            {props.type === "Dépense" &&
              categorieD.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            {props.type === "Recette" &&
              categorieR.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
          </select>

          <input
            value={selectedDate}
            className="w-96 h-10 px-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl"
            type="date"
            onChange={(e) => {
              handleDateChange(e);
              handleInputChange();
            }}
            required
          />

          <textarea
            value={selectedDetail}
            className="w-96 h-10 px-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl"
            placeholder="Détails"
            maxLength={250}
            onChange={(e) => {
              handleDetail(e);
              handleInputChange();
            }}
          />

          <input
            value={selectedMontant}
            className="w-96 h-10 px-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl"
            type="number"
            min="0"
            step="0.01"
            placeholder="Montant"
            onChange={(e) => {
              handleMontant(e);
              handleInputChange();
            }}
            required
          />

          <Button
            variant="outline"
            className="rounded-xl w-1/4 bg-zinc-100 dark:bg-zinc-900 hover:border-blue-500"
          >
            Soumettre la {props.type.toLowerCase()}
          </Button>
        </form>
        {(message || messageError) && (
          <CardMessage
            color={message ? "bg-green-500" : "bg-red-500"}
            message={
              message ? (
                <>
                  {message}{" "}
                  <Link
                    to={`/${lUrl}/${addedOperationDate}/${addedOperationId}`}
                    className="underline transition-all hover:text-zinc-50 hover:dark:text-zinc-950"
                  >
                    Allez-y
                  </Link>
                  <span>!</span>
                </>
              ) : (
                messageError
              )
            }
          />
        )}
      </section>
    </>
  );
}
