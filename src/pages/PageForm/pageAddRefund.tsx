"use client";

import { Button } from "../../../@/components/ui/button";

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

export default function PageAddRefund(props: any) {
  const [selectedTitre, setSelectedTitre] = useState("");

  const [selectedDate, setSelectedDate] = useState(getCurrentDate);

  const [selectedDetail, setSelectedDetail] = useState("");

  const [selectedMontant, setSelectedMontant] = useState("");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");

  const handleInputChange = () => {
    setMessage("");
    setMessageError("");
  };

  const dispatch = useDispatch();

  const resetForm = () => {
    setSelectedTitre("");
    setSelectedDetail("");
    setSelectedMontant("");
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

  const handleAddRefund = async (event: any) => {
    event.preventDefault();

    const refundData = {
      titre: selectedTitre,
      date: selectedDate,
      detail: selectedDetail,
      montant: separateMillier(selectedMontant),
    };

    function removeTiret(number: any): number {
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
        await dispatch(addRefund(props.transactionId, refundData) as any);
        await dispatch(editTransactions(editData) as any);
        dispatch(getTransactions() as any);
        resetForm();
        setMessage("Votre remboursement a été ajouté ! ");
      } catch {
        setMessageError(
          "Une erreur s'est produite lors de l'ajout du remboursement !",
        );
      }
    } else {
      setMessageError("Erreur: montant invalide.");
    }
  };

  return (
    <>
      <section className="h-full">
        <form
          onSubmit={handleAddRefund}
          className="flex flex-col justify-center items-center gap-5 px-36 py-10"
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
              handleInputChange();
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
              handleInputChange();
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
              handleInputChange();
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
              handleInputChange();
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

        {message || messageError ? (
          <div
            className={`fixed animate-[fadeIn2_0.3s_ease-in-out_forwards] bottom-4 right-4 flex justify-center items-center`}
          >
            <p
              className={`p-4 bg-lime-900 w-60 rounded ${message ? "opacity-100" : "hidden"}`}
            >
              {message}
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
