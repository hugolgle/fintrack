"use client";

import { Button } from "../../components/ui/button";

import {
  formatMontant,
  getCurrentDate,
  separateMillier,
} from "../../utils/fonctionnel";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";

import {
  editTransactions,
  getTransactions,
} from "../../redux/actions/transaction.action";
import { addRefund } from "../../redux/actions/refund.action";
import { MessageContext } from "@/context/MessageContext";

export default function PageAddRefund(props) {
  const messageContext = useContext(MessageContext);
  if (!messageContext) {
    throw new Error("MyComponent must be used within a MessageProvider");
  }
  const { showMessage } = messageContext;

  const [selectedTitre, setSelectedTitre] = useState("");

  const [selectedDate, setSelectedDate] = useState(getCurrentDate);

  const [selectedDetail, setSelectedDetail] = useState("");

  const [selectedMontant, setSelectedMontant] = useState("");

  const dispatch = useDispatch();

  const resetForm = () => {
    setSelectedTitre("");
    setSelectedDetail("");
    setSelectedMontant("");
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleDetail = (event) => {
    setSelectedDetail(event.target.value);
  };

  const handleTitre = (event) => {
    setSelectedTitre(event.target.value);
  };

  const handleMontant = (event) => {
    setSelectedMontant(event.target.value);
  };

  const handleAddRefund = async (event) => {
    event.preventDefault();

    const refundData = {
      titre: selectedTitre,
      date: selectedDate,
      detail: selectedDetail,
      montant: separateMillier(selectedMontant),
    };

    function removeTiret(number) {
      return parseFloat(number.replace(/-/g, ""));
    }

    const montantNumerique = parseFloat(props.montant);
    const selectedMontantNumerique = removeTiret(selectedMontant);

    if (!isNaN(montantNumerique) && !isNaN(selectedMontantNumerique)) {
      const newMontant = montantNumerique + selectedMontantNumerique;

      const editData = {
        id: props.transactionId,
        montant: formatMontant(newMontant, ""),
      };

      try {
        await dispatch(addRefund(props.transactionId, refundData));
        await dispatch(editTransactions(editData));
        dispatch(getTransactions());
        resetForm();
        showMessage("Votre remboursement a été ajouté !", "bg-green-500");
      } catch {
        showMessage(
          "Une erreur s'est produite lors de l'ajout du remboursement !",
          "bg-red-500"
        );
      }
    } else {
      showMessage("Erreur: montant invalide.", "bg-red-500");
    }
  };

  return (
    <>
      <section className="h-full">
        <form
          onSubmit={handleAddRefund}
          className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
        >
          <input
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
            value={selectedTitre}
            type="text"
            name=""
            maxLength={50}
            placeholder="Titre"
            onChange={(e) => {
              handleTitre(e);
            }}
            required
          />

          <input
            value={selectedDate}
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
            type="date"
            name=""
            onChange={(e) => {
              handleDateChange(e);
            }}
            required
          />

          <textarea
            value={selectedDetail}
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
            name=""
            placeholder="Détails"
            maxLength={250}
            onChange={(e) => {
              handleDetail(e);
            }}
          />

          <input
            value={selectedMontant}
            className="w-96 h-10 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-900"
            type="number"
            min="-10"
            step="0.01"
            name=""
            placeholder="Montant"
            onChange={(e) => {
              handleMontant(e);
            }}
            required
          />

          <Button
            variant="outline"
            className="rounded-xl w-1/4 bg-zinc-100 dark:bg-zinc-900 hover:border-blue-500"
          >
            Soumettre le remboursement
          </Button>
        </form>
      </section>
    </>
  );
}
