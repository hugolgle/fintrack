import { Link, useNavigate, useParams } from "react-router-dom";

import {
  addSpace,
  convertDateHour,
  convertirFormatDate,
  formatDate,
  formatMontant,
  separateMillier,
} from "../../../utils/fonctionnel";
import {
  getTitleOfTransactionsByType,
  getTransactionById,
} from "../../../utils/operations";

import {
  categorieRecette,
  categorieDepense,
} from "../../../../public/categories.json";

import {
  deleteTransactions,
  editTransactions,
  getTransactions,
} from "../../../redux/actions/transaction.action";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import PageAddRefund from "../../PageForm/pageAddRefund";
import { categorieSort } from "../../../utils/other";
import BtnReturn from "../../../components/Button/btnReturn";
import BtnAdd from "../../../components/Button/btnAdd";
import Title from "../../../components/Text/title";
import CardMessage from "../../../components/cardMessage";

export default function Transaction() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const categorieD = categorieSort(categorieDepense);
  const categorieR = categorieSort(categorieRecette);

  const { id } = useParams();
  const transaction = getTransactionById(id);

  const suggestions: any[] = getTitleOfTransactionsByType(transaction.type);

  const [selectedDelete, setSelectedDelete] = useState(false);

  const [selectedUpdate, setSelectedUpdate] = useState(false);

  const [update, setUpdate] = useState(false);

  const [selectedTitre, setSelectedTitre] = useState(transaction.titre);

  const [selectedCategorie, setSelectedCategorie] = useState(
    transaction.categorie
  );

  const [selectedDate, setSelectedDate] = useState(transaction.date);

  const [selectedDetail, setSelectedDetail] = useState(transaction.detail);

  const calculateTotalRefunds = () => {
    let totalRefunds = 0;
    if (transaction.remboursements && transaction.remboursements.length > 0) {
      transaction.remboursements.forEach((refund: any) => {
        totalRefunds += parseFloat(refund.montant);
      });
    }
    const montant = totalRefunds - parseFloat(transaction.montant);
    return `-${montant}`;
  };

  const montantPaye = calculateTotalRefunds();

  const [selectedMontant, setSelectedMontant] = useState(
    transaction.remboursements && transaction.remboursements.length > 0
      ? montantPaye
      : transaction.montant
  );

  const handleTitre = (event: any) => {
    setSelectedTitre(event.target.value);
  };

  const handleCategorie = (event: any) => {
    setSelectedCategorie(event.target.value);
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

  const handleInputChange = () => {
    setUpdate(true);
  };

  const [refundVisible, setRefundVisible] = useState(false);

  const handleRefund = () => {
    setRefundVisible(!refundVisible);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteConfirmation = async () => {
    await dispatch(deleteTransactions(id) as any);
    navigate(-1);
    dispatch(getTransactions() as any);
    localStorage.setItem("transactionDeleted", "true");
  };

  function removeTiret(number: any): number {
    if (typeof number === "string") {
      return parseFloat(number.replace(/-/g, ""));
    } else {
      console.error("Invalid input, expected a string:", number);
      return NaN;
    }
  }

  const montantFinal =
    transaction.montant +
    transaction.remboursements.reduce((acc: any, refund: any) => {
      return acc + parseFloat(refund.montant);
    }, 0);

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
    await dispatch(editTransactions(editData) as any);
    setMessage("L'opération a été modifié avec succès !");
    dispatch(getTransactions() as any);
    setSelectedUpdate(false);
  };

  const typeProps =
    transaction.type === "Dépense"
      ? "depense"
      : transaction.type === "Recette"
        ? "recette"
        : undefined;

  return (
    <>
      <div className="w-full h-auto relative">
        {selectedUpdate ? (
          <>
            <input
              className="text-5xl animate-[pulseEdit_1s_ease-in-out_infinite] rounded-2xl text-center font-thin mb-5 bg-transparent"
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
          <Title title={transaction.titre} />
        )}

        <div
          className={`${refundVisible ? "hidden" : "absolute top-0 flex flex-row gap-2 w-full"}`}
        >
          <BtnReturn />
          <BtnAdd to={`/${typeProps}`} />
        </div>
        {transaction.type === "Dépense" && (
          <button
            className="absolute top-0 right-0 flex flex-row gap-2 cursor-pointer border-1 hover:border-blue-500 transition-all"
            onClick={handleRefund}
          >
            {refundVisible ? "Revenir" : "Ajouter un remboursement"}
          </button>
        )}
      </div>

      {refundVisible && (
        <PageAddRefund
          transactionId={transaction._id}
          montant={transaction.montant}
        />
      )}
      <section
        className={`${refundVisible ? "hidden" : "flex flex-row gap-4"}`}
      >
        <div className="flex flex-col w-3/4 gap-4 animate-fade">
          <div className="h-40 p-8 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex justify-center items-center">
            <h2 className="text-4xl">{transaction._id}</h2>
          </div>
          <div className="flex flex-row gap-4">
            <div
              className={`h-40 w-full  bg-zinc-100 dark:bg-zinc-900 flex justify-center items-center rounded-2xl ${selectedUpdate ? "animate-[pulseEdit_1s_ease-in-out_infinite] p-0" : "p-8"}`}
            >
              {selectedUpdate ? (
                <select
                  id="action"
                  value={selectedCategorie}
                  className="h-full w-full bg-transparent text-center text-4xl rounded-2xl"
                  onChange={(e) => {
                    handleCategorie(e);
                    handleInputChange();
                  }}
                  required
                >
                  <option disabled selected>
                    Entrez la catégorie
                  </option>
                  {transaction.type === "Dépense" &&
                    categorieD.map(({ name }) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  {transaction.type === "Recette" &&
                    categorieR.map(({ name }) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                </select>
              ) : (
                <h2 className="text-4xl">{transaction.categorie}</h2>
              )}
            </div>

            <div
              className={`h-40 w-full bg-zinc-100 dark:bg-zinc-900 flex justify-center items-center rounded-2xl ${selectedUpdate ? "animate-[pulseEdit_1s_ease-in-out_infinite] p-0" : "p-8"}`}
            >
              {selectedUpdate ? (
                <input
                  className="h-full w-full bg-transparent text-center text-4xl  rounded-2xl"
                  value={selectedDate}
                  type="date"
                  name=""
                  onChange={(e) => {
                    handleDate(e);
                    handleInputChange();
                  }}
                />
              ) : (
                <h2 className="text-4xl">{formatDate(transaction.date)}</h2>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div
              className={`min-h-40 w-full  bg-zinc-100 dark:bg-zinc-900 flex justify-center items-center rounded-2xl ${selectedUpdate ? "animate-[pulseEdit_1s_ease-in-out_infinite] p-0" : "py-8"}`}
            >
              {selectedUpdate ? (
                <input
                  className="h-full w-full bg-transparent text-center text-4xl  rounded-2xl"
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
                  <p>
                    Montant{" "}
                    {transaction.remboursements &&
                    transaction.remboursements.length > 0
                      ? "payé"
                      : ""}
                  </p>
                  <h2 className="text-4xl">
                    {transaction.type === "Dépense"
                      ? `${addSpace(parseFloat(montantPaye).toFixed(2))} €`
                      : `${addSpace(parseFloat(transaction.montant).toFixed(2))} €`}
                  </h2>
                </div>
              )}
            </div>
            {transaction.remboursements &&
              transaction.remboursements.length > 0 && (
                <Link
                  to="refund/"
                  className="min-h-40 w-full flex-col bg-zinc-100 dark:bg-zinc-900 flex items-center rounded-2xl py-8 transition-all hover:bg-opacity-80 hover:scale-95"
                >
                  <p>Remboursement(s)</p>
                  <table className="w-full mt-2">
                    <tbody>
                      {transaction.remboursements.map((refund: any) => (
                        <tr key={refund._id}>
                          <td>{convertirFormatDate(refund.date)}</td>
                          <td>{refund.titre}</td>
                          <td>
                            <b>{addSpace(refund.montant)} €</b>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Link>
              )}

            {transaction.remboursements &&
              transaction.remboursements.length > 0 && (
                <div className="min-h-40 w-full flex-col bg-zinc-100 dark:bg-zinc-900 flex items-center rounded-2xl py-8">
                  <div className="flex flex-col">
                    <p>Montant final</p>
                    <h2 className="text-4xl">
                      {separateMillier(montantFinal)} €
                    </h2>
                  </div>
                </div>
              )}
          </div>
          <div className="flex flex-row gap-4">
            <div
              className={`h-40 w-full bg-zinc-100 dark:bg-zinc-900 flex justify-center items-center rounded-2xl ${selectedUpdate ? "animate-[pulseEdit_1s_ease-in-out_infinite] p-0" : "p-8"}`}
            >
              {selectedUpdate ? (
                <textarea
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
            <div className="p-8 h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex justify-center items-center">
              <p>
                Ajouter le : <br />
                <b>{convertDateHour(transaction.createdAt)}</b>
              </p>
            </div>
            {transaction.updatedAt !== transaction.createdAt && (
              <div className="p-8 h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex justify-center items-center">
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
                    className="p-8 border-2 border-red-900 bg-zinc-100 dark:bg-zinc-900 rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95"
                    onClick={() => handleEditConfirmation()}
                  >
                    Oui
                  </div>
                  <div
                    className="p-8 border-2 border-zinc-900 bg-zinc-100 dark:bg-zinc-900 rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95 hover:border-green-900"
                    onClick={() => setSelectedUpdate(false)}
                  >
                    Non
                  </div>
                </div>
              </div>
            ) : selectedUpdate ? (
              <div
                className="p-8 h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex justify-center items-center hover:bg-opacity-80 cursor-pointer transition-all hover:scale-95"
                onClick={() => setSelectedUpdate(false)}
              >
                Annuler
              </div>
            ) : (
              <div
                className="p-8 h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex justify-center items-center hover:bg-opacity-80 cursor-pointer transition-all hover:scale-95"
                onClick={() => setSelectedUpdate(true)}
              >
                Modifier
              </div>
            )}
            <div className="flex flex-col gap-4 justify-center items-center">
              {selectedDelete ? (
                <div className="flex flex-col gap-4 justify-center items-center">
                  <p className="text-sm">Êtes-vous sûr ?</p>
                  <div className="flex gap-4">
                    <div
                      className="p-8 border-2 border-red-900 bg-zinc-100 dark:bg-zinc-900 rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95"
                      onClick={handleDeleteConfirmation}
                    >
                      Oui
                    </div>
                    <div
                      className="p-8 border-2 border-zinc-900 bg-zinc-100 dark:bg-zinc-900 rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95 hover:border-green-900"
                      onClick={() => setSelectedDelete(false)}
                    >
                      Non
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`w-full p-8 h-32 border-2 border-red-900 bg-zinc-100 dark:bg-zinc-900  rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95`}
                  onClick={() => setSelectedDelete(true)}
                >
                  Supprimer
                </div>
              )}
            </div>
          </div>
        </div>
        {message ? (
          <CardMessage message={message} color="bg-green-500" />
        ) : null}
      </section>
    </>
  );
}
