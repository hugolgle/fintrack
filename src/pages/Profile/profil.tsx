import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { infoUser } from "../../utils/users";
import { deleteUser, editUser } from "../../redux/actions/user.action";
import { formatDate } from "../../utils/fonctionnel";
import Title from "../../components/Text/title";

export default function Profil() {
  const userInfo = infoUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDelete, setSelectedDelete] = useState(false);

  const handleDeleteConfirmation = async () => {
    const confirmed = window.confirm("Cette action est irréversible ?");
    if (confirmed) {
      await dispatch(deleteUser(userInfo.id) as any);
      navigate("/");
    } else {
      setSelectedDelete(false);
    }
  };

  const [selectedUpdate, setSelectedUpdate] = useState(false);
  const [update, setUpdate] = useState(false);

  const [prenom, setPrenom] = useState(userInfo?.prenom ?? "");
  const [nom, setNom] = useState(userInfo?.nom ?? "");
  const [username, setUsername] = useState(userInfo?.username ?? "");
  const [pseudo, setPseudo] = useState(userInfo?.pseudo ?? "");
  const [message, setMessage] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = () => {
    setMessage(null);
    setUpdate(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      handleInputChange();
    }
  };

  const handleUpdateConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_id", userInfo.id);
    formData.append("username", username);
    formData.append("pseudo", pseudo);
    formData.append("nom", nom);
    formData.append("prenom", prenom);

    if (selectedFile) {
      formData.append("img", selectedFile);
    }

    try {
      await dispatch(editUser(formData) as any);
      setSelectedUpdate(false);
      setMessage("Modification effectuée !");
    } catch (err) {
      console.error("Erreur lors de la modification :", err);
      setMessage("Modification échouée !");
    }
  };

  return (
    <>
      <section className="flex flex-col gap-4">
        <Title title="Profil" />
        <div className="flex flex-row gap-4 animate-fade">
          <div className="flex-col w-3/4 py-12 bg-zinc-100 dark:bg-zinc-900 flex justify-start items-center rounded-2xl gap-6">
            <div className="relative">
              <div className="w-full"></div>
              {selectedUpdate ? (
                <div className="flex flex-col items-center">
                  {selectedFile ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Aperçu"
                      className="rounded-full  w-32 h-32 object-cover"
                    />
                  ) : (
                    <img
                      src={
                        userInfo?.img
                          ? `http://localhost:5001/${userInfo?.img}`
                          : "../../../public/img/imgProfil.svg"
                      }
                      alt="PP"
                      className={`rounded-full w-32 h-32 object-cover${userInfo?.img ? "" : "bg-red-200 dark:bg-red-400"}`}
                    />
                  )}
                  <label
                    htmlFor="image"
                    className="cursor-pointer mt-3 rounded-xl bg-zinc-300 dark:bg-zinc-800 py-2 px-4 hover:scale-95 transition-all"
                  >
                    Modifier ta photo de profil
                  </label>
                  <input
                    className="hidden"
                    type="file"
                    id="image"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="rounded-full w-32 h-32 overflow-hidden">
                  <img
                    src={
                      userInfo?.img
                        ? `http://localhost:5001/${userInfo?.img}`
                        : "../../../public/img/imgProfil.svg"
                    }
                    alt="PP"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <p>Prénom :</p>
              {selectedUpdate ? (
                <input
                  type="text"
                  value={prenom}
                  className="p-2 bg-transparent rounded border-1 border-blue-800 animate-[pulseEdit_1s_ease-in-out_infinite]"
                  onChange={(e) => {
                    setPrenom(e.target.value);
                    handleInputChange();
                  }}
                  required
                />
              ) : (
                <p>
                  <b>{userInfo.prenom}</b>
                </p>
              )}
            </div>
            <div>
              <p>Nom :</p>
              {selectedUpdate ? (
                <input
                  type="text"
                  value={nom}
                  className="p-2 bg-transparent rounded border-1 border-blue-800 animate-[pulseEdit_1s_ease-in-out_infinite]"
                  onChange={(e) => {
                    setNom(e.target.value);
                    handleInputChange();
                  }}
                  required
                />
              ) : (
                <p>
                  <b>{userInfo.nom}</b>
                </p>
              )}
            </div>
            <div>
              <p>Nom d'utilisateur :</p>
              {selectedUpdate ? (
                <input
                  type="text"
                  value={username}
                  className="p-2 bg-transparent rounded border-1 border-blue-800 animate-[pulseEdit_1s_ease-in-out_infinite]"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    handleInputChange();
                  }}
                  required
                />
              ) : (
                <p>
                  <b>{userInfo.username}</b>
                </p>
              )}
            </div>
            <div>
              <p>Pseudo :</p>
              {selectedUpdate ? (
                <input
                  type="text"
                  value={pseudo}
                  className="p-2 bg-transparent rounded border-1 border-blue-800 animate-[pulseEdit_1s_ease-in-out_infinite]"
                  onChange={(e) => {
                    setPseudo(e.target.value);
                    handleInputChange();
                  }}
                  required
                />
              ) : (
                <p>
                  <b>{userInfo.pseudo}</b>
                </p>
              )}
            </div>
            {!selectedUpdate && (
              <div>
                <p>Inscript le :</p>
                <p>
                  <b>{formatDate(userInfo.date)}</b>
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col w-3/4 gap-4">
            {/* {selectedDelete ? (
              <div className="flex flex-col gap-4 h-40 justify-center items-center">
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
                className={`h-full w-full cursor-pointer bg-zinc-100 dark:bg-zinc-900 flex justify-center items-center rounded-2xl hover:bg-opacity-80 transition-all hover:scale-95`}
                onClick={() => setSelectedDelete(true)}
              >
                Supprimer mon compte
              </div>
            )} */}

            {selectedUpdate && update ? (
              <div className="flex flex-col gap-4 justify-center items-center">
                <p className="text-sm">Êtes-vous sûr de vouloir modifier ?</p>
                <div className="flex gap-4">
                  <div
                    className="p-8 border-2 border-red-900 bg-zinc-100 dark:bg-zinc-900 rounded-2xl cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95"
                    onClick={handleUpdateConfirmation}
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
                className="h-full w-full cursor-pointer bg-zinc-100 dark:bg-zinc-900 flex justify-center items-center rounded-2xl hover:bg-opacity-80 transition-all hover:scale-95"
                onClick={() => setSelectedUpdate(false)}
              >
                Annuler
              </div>
            ) : (
              <div
                className="h-full w-full cursor-pointer bg-zinc-100 dark:bg-zinc-900 flex justify-center items-center rounded-2xl hover:bg-opacity-80 transition-all hover:scale-95"
                onClick={() => setSelectedUpdate(true)}
              >
                Modifier
              </div>
            )}

            <div className="h-full w-full bg-zinc-100 dark:bg-zinc-900 flex justify-center items-center rounded-2xl">
              Exporter les données
            </div>
            <div className="h-full w-full bg-zinc-100 dark:bg-zinc-900 flex justify-center items-center rounded-2xl">
              Supprimer les données
            </div>
          </div>
        </div>
        {message && (
          <div className="absolute bottom-4 right-4 flex justify-center transition-all items-center animate-[fadeIn_7s_ease-in-out_forwards]">
            <p className="p-4 bg-lime-900 w-60 rounded shadow-2xl shadow-black">
              {message}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
