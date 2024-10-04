"use client";

import { Button } from "../../components/ui/button";

import {
  formatMontant,
  getCurrentDate,
  separateMillier,
} from "../../utils/fonctionnel";
import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  editTransactions,
  getTransactions,
} from "../../redux/actions/transaction.action";
import { addRefund } from "../../redux/actions/refund.action";
import { toast } from "sonner";

export default function PageAddRefund(props) {
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

    const isValid = await form.trigger();
    if (!isValid) {
      toast("Veuillez remplir tous les champs requis.");
      return;
    }

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
        toast("Votre remboursement a été ajouté !");
      } catch {
        toast(
          "Une erreur s'est produite lors de l'ajout du remboursement !",
          "bg-red-500"
        );
      }
    } else {
      toast("Erreur: montant invalide.");
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
            className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark"
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
            className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark"
            type="date"
            name=""
            onChange={(e) => {
              handleDateChange(e);
            }}
            required
          />

          <textarea
            value={selectedDetail}
            className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark"
            name=""
            placeholder="Détails"
            maxLength={250}
            onChange={(e) => {
              handleDetail(e);
            }}
          />

          <input
            value={selectedMontant}
            className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark"
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
            className="rounded-xl w-1/4 bg-colorSecondaryLight dark:bg-colorPrimaryDark hover:border-blue-500"
          >
            Soumettre le remboursement
          </Button>
        </form>
      </section>
    </>
  );
}
