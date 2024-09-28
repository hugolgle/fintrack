import { useNavigate, useParams } from "react-router-dom";
import { separateMillier } from "../../../utils/fonctionnel";
import {
  editTransactions,
  getTransactions,
} from "../../../redux/actions/transaction.action";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { deleteRefund, editRefund } from "../../../redux/actions/refund.action";
import {
  getRefundByTransactionId,
  getTransactionById,
} from "../../../utils/operations";
import CardMessage from "../../../components/cardMessage";

export default function Refund() {
  const [message, setMessage] = useState(""); // State for showing messages

  const { id, idRefund } = useParams();
  const refund = getRefundByTransactionId(id, idRefund);
  const transaction = getTransactionById(id);

  const [selectedRefundTitre, setSelectedTitre] = useState(refund.titre);
  const [selectedRefundDate, setSelectedDate] = useState(refund.date);
  const [selectedRefundDetail, setSelectedDetail] = useState(refund.detail);
  const [selectedRefundMontant, setSelectedMontant] = useState(refund.montant);

  const handleTitre = (event: any) => {
    setSelectedTitre(event.target.value);
  };

  const handleDate = (event: any) => {
    setSelectedDate(event.target.value);
  };

  const handleDetail = (event: any) => {
    setSelectedDetail(event.target.value);
  };

  const handleMontant = (event: any) => {
    setSelectedMontant(event.target.value);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEditRefund = async (e: any) => {
    e.preventDefault();
    const refundData = {
      id: refund._id,
      titre: selectedRefundTitre,
      date: selectedRefundDate,
      detail: selectedRefundDetail,
      montant: selectedRefundMontant,
    };
    try {
      await dispatch(editRefund(id, refundData) as any);
      setMessage("Le remboursement a été modifié avec succès."); // Success message
    } catch (error) {
      setMessage("Erreur lors de la modification du remboursement."); // Error message
    }
    navigate(-1);
  };

  function removeTiret(number: any): number {
    return parseFloat(number.replace(/-/g, ""));
  }

  const montantNumerique = parseFloat(transaction.montant);
  const selectedMontantNumerique = removeTiret(refund.montant);
  const newMontant = montantNumerique - selectedMontantNumerique;

  const editData = {
    id: id,
    montant: separateMillier(newMontant),
  };

  const handleDeleteRefund = async () => {
    try {
      await dispatch(deleteRefund(id, refund._id) as any);
      await dispatch(editTransactions(editData) as any);
      dispatch(getTransactions() as any);
      setMessage("Le remboursement a été supprimé avec succès."); // Success message
    } catch (error) {
      setMessage("Erreur lors de la suppression du remboursement."); // Error message
    }
    navigate(-1);
  };

  return (
    <>
      <form
        onSubmit={handleEditRefund}
        className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
      >
        <input
          className="w-96 h-10 px-2 rounded-xl"
          value={selectedRefundTitre}
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
          value={selectedRefundDate}
          className="w-96 h-10 px-2 rounded-xl"
          type="date"
          name=""
          onChange={(e) => {
            handleDate(e);
          }}
          required
        />

        <textarea
          value={selectedRefundDetail}
          className="w-96 h-10 px-2 rounded-xl"
          name=""
          placeholder="Détails"
          maxLength={250}
          onChange={(e) => {
            handleDetail(e);
          }}
        />

        <input
          value={selectedRefundMontant}
          className="w-96 h-10 px-2 rounded-xl"
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

        <button className="rounded-xl w-1/4 hover:border-blue-500">
          Modifier le remboursement
        </button>
      </form>
      <button
        className="rounded-xl w-1/4 hover:border-red-500"
        onClick={handleDeleteRefund}
      >
        Supprimer le remboursement
      </button>
      {message && <CardMessage message={message} color="bg-green-500" />}{" "}
    </>
  );
}
