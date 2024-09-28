"use client";

import { Button } from "../../../@/components/ui/button";
import { Link } from "react-router-dom";
import { getCurrentDate, separateMillier } from "../../utils/fonctionnel";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { infoUser } from "../../utils/users";
import {
  addInvestments,
  getInvestments,
} from "../../redux/actions/investment.action";
import BtnReturn from "../../components/Button/btnReturn";
import { getAllInvestments } from "../../utils/operations";
import Title from "../../components/Text/title";

interface Investment {
  titre: string;
  type: string;
  date: string; // Assurez-vous que `date` est une chaîne au format de date
}

export default function PageAddInvest() {
  const userInfo = infoUser();
  const getInvest: Investment[] = getAllInvestments(null);
  const suggestionsTitle = Array.from(
    new Set(getInvest.map((investment) => investment.titre)),
  );

  const [selectedDate, setSelectedDate] = useState(getCurrentDate);
  const [selectedType, setSelectedType] = useState("");
  const [selectedTitre, setSelectedTitre] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedMontant, setSelectedMontant] = useState("");
  const [addedOperationDate, setAddedOperationDate] = useState("");
  const [addedOperationId, setAddedOperationId] = useState("");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedTitre) {
      // Trouver le dernier investissement avec le titre sélectionné
      const lastInvestment = getInvest
        .filter((investment) => investment.titre === selectedTitre)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0];

      // Mettre à jour le champ type si un investissement est trouvé
      if (lastInvestment) {
        setSelectedType(lastInvestment.type || "");
      }
    }
  }, [selectedTitre, getInvest]);

  const handleInputChange = () => {
    setMessage("");
    setMessageError("");
    setAddedOperationDate("");
    setAddedOperationId("");
  };

  const resetForm = () => {
    setSelectedDetail("");
    setSelectedType("");
    setSelectedTitre("");
    setSelectedMontant("");
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const postData = {
      user: userInfo.id,
      type: selectedType,
      titre: selectedTitre,
      detail: selectedDetail,
      date: selectedDate,
      montant: separateMillier(selectedMontant),
    };

    try {
      const response = await dispatch(addInvestments(postData) as any);
      const newOperationId = response.data._id;
      setAddedOperationId(newOperationId);
      dispatch(getInvestments() as any);
      resetForm();

      const transactionDate = new Date(selectedDate);
      const formattedDate = `${transactionDate.getFullYear()}${(transactionDate.getMonth() + 1).toString().padStart(2, "0")}`;
      setAddedOperationDate(formattedDate);
      setMessage("Votre investissement a été ajouté ! ");
    } catch {
      setMessageError(
        "Une erreur s'est produite lors de l'ajout de l'opération",
      );
    }
  };

  return (
    <>
      <section className="h-full">
        <Title title="Ajouter un investissement" />

        <div className="absolute top-4 left-4">
          <BtnReturn />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5 px-36 py-10"
        >
          <input
            value={selectedDate}
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
            type="date"
            onChange={(e) => {
              setSelectedDate(e.target.value);
              handleInputChange();
            }}
            required
          />

          <input
            list="title-suggestions"
            value={selectedTitre}
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
            type="text"
            maxLength={50}
            placeholder="Titre"
            onChange={(e) => {
              setSelectedTitre(e.target.value);
              handleInputChange();
            }}
            required
          />

          <datalist id="title-suggestions">
            {suggestionsTitle.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>

          <select
            value={selectedType}
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
            onChange={(e) => {
              setSelectedType(e.target.value);
              handleInputChange();
            }}
            required
          >
            <option disabled value="">
              Entrez la catégorie
            </option>
            <option value="Action">Action</option>
            <option value="ETF">ETF</option>
            <option value="Crypto">Crypto</option>
            <option value="Obligation">Obligation</option>
            <option value="Dérivé">Dérivé</option>
          </select>

          <textarea
            value={selectedDetail}
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
            placeholder="Détails"
            maxLength={250}
            onChange={(e) => {
              setSelectedDetail(e.target.value);
              handleInputChange();
            }}
          />

          <input
            value={selectedMontant}
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
            type="number"
            min="0"
            step="0.01"
            placeholder="Montant"
            onChange={(e) => {
              setSelectedMontant(e.target.value);
              handleInputChange();
            }}
            required
          />

          <Button
            variant="outline"
            className="rounded-xl w-1/4 bg-zinc-100 dark:bg-zinc-900 hover:border-blue-500"
          >
            Soumettre
          </Button>
        </form>
        {message || messageError ? (
          <div
            className={`fixed animate-[fadeIn2_0.3s_ease-in-out_forwards] bottom-4 right-4 flex justify-center items-center`}
          >
            <p
              className={`p-4 bg-lime-900 w-60 rounded ${message ? "opacity-100" : "hidden"}`}
            >
              {message}{" "}
              <Link
                to={`/invest/operations/${addedOperationId}`}
                className="underline transition-all hover:text-zinc-950"
              >
                Allez-y !
              </Link>
            </p>
            <p
              className={`p-4 bg-red-900 w-60 rounded ${messageError ? "opacity-100" : "hidden"}`}
            >
              {messageError}
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}
