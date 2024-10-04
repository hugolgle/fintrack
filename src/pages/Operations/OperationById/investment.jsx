import { useNavigate, useParams } from "react-router-dom";

import {
  convertDateHour,
  formatDate,
  separateMillier,
} from "../../../utils/fonctionnel";
import { getInvestmentById } from "../../../utils/operations";

import { useDispatch } from "react-redux";
import { useContext, useState } from "react";
import {
  deleteInvestments,
  editInvestments,
  getInvestments,
  soldInvestments,
} from "../../../redux/actions/investment.action";
import LayoutOperation from "../../../layout/layoutOperation";
import { toast } from "sonner";

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

  const handleType = (event) => {
    setSelectedType(event.target.value);
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
    toast("L'opération a été supprimé avec succès !");
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
    toast("L'opération a été modifié avec succès !");
    dispatch(getInvestments());
    setSelectedUpdate(false);
  };

  const handleSoldConfirmation = async () => {
    await dispatch(soldInvestments(investment._id, selectedMontantVendu));
    toast("L'investissement a été vendu avec succès !", "bg-grenn-500");
    dispatch(getInvestments());
    setSelectedUpdate(false);
  };

  return (
    <>
      <LayoutOperation title={investment.titre} typeProps="invest" pageById />
      <section className="flex flex-col gap-4 ">
        <div className="flex flex-row gap-4 animate-fade">
          <div className="flex flex-col gap-4 w-3/4">
            <div
              className={`h-40 w-full  bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl ${selectedUpdate ? "animate-[pulseEdit_1s_ease-in-out_infinite] p-0" : "p-8"}`}
            >
              {selectedUpdate ? (
                <input
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

            <div className="flex flex-row w-full gap-4">
              <div
                className={`h-40 w-full  bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl ${selectedUpdate ? "animate-[pulseEdit_1s_ease-in-out_infinite] p-0" : "p-8"}`}
              >
                {selectedUpdate ? (
                  <input
                    className="h-full w-full bg-transparent text-center text-4xl  rounded-2xl"
                    value={selectedType}
                    type="text"
                    name=""
                    onChange={(e) => {
                      handleType(e);
                      handleInputChange();
                    }}
                    placeholder="Type"
                  />
                ) : (
                  <h2 className="text-4xl">{investment.type}</h2>
                )}
              </div>
            </div>
            <div className="flex flex-row w-full gap-4">
              <div
                className={`h-40 w-full bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl ${selectedUpdate ? "animate-[pulseEdit_1s_ease-in-out_infinite] p-0" : "p-8"}`}
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
                  <h2 className="text-4xl">{formatDate(investment.date)}</h2>
                )}
              </div>
              <div
                className={`h-40 w-full  bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl ${selectedUpdate ? "animate-[pulseEdit_1s_ease-in-out_infinite] p-0" : "p-8"}`}
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
                  <h2 className="text-4xl">{investment.montant} €</h2>
                )}
              </div>
            </div>
            <div
              className={`h-40 w-full bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl ${selectedUpdate ? "animate-[pulseEdit_1s_ease-in-out_infinite] p-0" : "p-8"}`}
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
                      <input
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
                        <button
                          className="cursor-pointer text-xs w-4/5 hover:bg-opacity-80 hover:scale-95 transition-all"
                          onClick={() => setSelectedVendre(false)}
                        >
                          Annuler
                        </button>
                        <button
                          className="cursor-pointer text-xs w-4/5 hover:bg-opacity-80 hover:scale-95 transition-all"
                          onClick={() => handleSoldConfirmation()}
                        >
                          Vendre
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="cursor-pointer w-4/5 hover:bg-opacity-80 hover:scale-95 transition-all"
                      onClick={() => setSelectedVendre(true)}
                    >
                      Vendre
                    </button>
                  )}
                </div>
              </>
            )}

            <div className="flex flex-col w-full gap-4">
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
                      onClick={() => setSelectedUpdate(false)}
                    >
                      Non
                    </div>
                  </div>
                </div>
              ) : selectedUpdate ? (
                <div
                  className="p-8 h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex justify-center items-center hover:bg-opacity-80 cursor-pointer hover:scale-95 transition-all"
                  onClick={() => setSelectedUpdate(false)}
                >
                  Annuler
                </div>
              ) : (
                <div
                  className="p-8 h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl flex justify-center items-center hover:bg-opacity-80 cursor-pointer hover:scale-95 transition-all"
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
                        className="p-8 border-2 border-red-900 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95"
                        onClick={handleDeleteConfirmation}
                      >
                        Oui
                      </div>
                      <div
                        className="p-8 border-2 border-zinc-900 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95 hover:border-green-900"
                        onClick={() => setSelectedDelete(false)}
                      >
                        Non
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`w-full p-8 h-32 border-2 border-red-900 bg-colorSecondaryLight dark:bg-colorPrimaryDark  rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95`}
                    onClick={() => setSelectedDelete(true)}
                  >
                    Supprimer
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
