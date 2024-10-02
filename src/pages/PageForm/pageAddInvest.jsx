"use client";

import { Button } from "../../components/ui/button";
import { getCurrentDate, separateMillier } from "../../utils/fonctionnel";
import { useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { infoUser } from "../../utils/users";
import {
  addInvestments,
  getInvestments,
} from "../../redux/actions/investment.action";
import BtnReturn from "../../composant/Button/btnReturn";
import { getAllInvestments } from "../../utils/operations";
import Title from "../../composant/Text/title";
import { MessageContext } from "@/context/MessageContext";

export default function PageAddInvest() {
  const messageContext = useContext(MessageContext);
  if (!messageContext) {
    throw new Error("MyComponent must be used within a MessageProvider");
  }
  const { showMessage } = messageContext;

  const userInfo = infoUser();
  const getInvest = getAllInvestments(null);
  const suggestionsTitle = Array.from(
    new Set(getInvest.map((investment) => investment.titre))
  );

  const [selectedDate, setSelectedDate] = useState(getCurrentDate);
  const [selectedType, setSelectedType] = useState("");
  const [selectedTitre, setSelectedTitre] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedMontant, setSelectedMontant] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedTitre) {
      // Trouver le dernier investissement avec le titre sélectionné
      const lastInvestment = getInvest
        .filter((investment) => investment.titre === selectedTitre)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

      // Mettre à jour le champ type si un investissement est trouvé
      if (lastInvestment) {
        setSelectedType(lastInvestment.type || "");
      }
    }
  }, [selectedTitre, getInvest]);

  const resetForm = () => {
    setSelectedDetail("");
    setSelectedType("");
    setSelectedTitre("");
    setSelectedMontant("");
  };

  const handleSubmit = async (event) => {
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
      await dispatch(addInvestments(postData));
      dispatch(getInvestments());
      resetForm();
      showMessage("Votre investissement a été ajouté ! ", "bg-green-500");
    } catch {
      showMessage(
        "Une erreur s'est produite lors de l'ajout de l'opération",
        "bg-red-500"
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
          className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
        >
          <input
            value={selectedDate}
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
            type="date"
            onChange={(e) => {
              setSelectedDate(e.target.value);
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
      </section>
    </>
  );
}
