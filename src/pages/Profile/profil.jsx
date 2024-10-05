// import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { getInitials, infoUser } from "../../utils/users";
import { editUser } from "../../redux/actions/user.action";
import { formatDate } from "../../utils/fonctionnel";
import Title from "../../composant/Text/title";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { SheetEditProfile } from "../../composant/sheetEditProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profil() {
  const userInfo = infoUser();
  // const navigate = useNavigate();
  // const [selectedDelete, setSelectedDelete] = useState(false);

  // const handleDeleteConfirmation = async () => {
  //   const confirmed = window.confirm("Cette action est irréversible ?");
  //   if (confirmed) {
  //     await dispatch(deleteUser(userInfo.id) as any);
  //     navigate("/");
  //   } else {
  //     setSelectedDelete(false);
  //   }
  // };

  const initialName = getInitials(userInfo?.prenom, userInfo?.nom);

  return (
    <>
      <section className="flex flex-col gap-4">
        <Title title="Profil" />
        <div className="flex flex-row gap-4 animate-fade">
          <div className="flex-col w-3/4 py-12 bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-start items-center rounded-2xl gap-6">
            <div className="relative">
              <div className="w-full"></div>

              <Avatar className="w-28 h-28">
                <AvatarImage
                  className="object-cover"
                  src={`http://localhost:5001/${userInfo?.img}`}
                />
                <AvatarFallback className="bg-colorPrimaryLight dark:bg-colorSecondaryDark">
                  {initialName}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p>Prénom :</p>

              <p>
                <b>{userInfo.prenom}</b>
              </p>
            </div>
            <div>
              <p>Nom :</p>

              <p>
                <b>{userInfo.nom}</b>
              </p>
            </div>
            <div>
              <p>E-mail :</p>

              <p>
                <b>{userInfo.username}</b>
              </p>
            </div>
            <div>
              <p>Pseudo :</p>

              <p>
                <b>{userInfo.pseudo}</b>
              </p>
            </div>
            <div>
              <p>Inscript le :</p>
              <p>
                <b>{formatDate(userInfo.date)}</b>
              </p>
            </div>
          </div>

          <div className="flex flex-col w-3/4 gap-4">
            {/* {selectedDelete ? (
              <div className="flex flex-col gap-4 h-40 justify-center items-center">
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
                className={`h-full w-full cursor-pointer bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl hover:bg-opacity-80 transition-all hover:scale-95`}
                onClick={() => setSelectedDelete(true)}
              >
                Supprimer mon compte
              </div>
            )} */}

            <SheetEditProfile
              btnOpen={
                <div className="h-full w-full cursor-pointer bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl hover:bg-opacity-80 transition-all hover:scale-95">
                  Modifier
                </div>
              }
              dataProfil={userInfo}
            />

            <div className="h-full w-full bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
              Exporter les données
            </div>
            <div className="h-full w-full bg-colorSecondaryLight dark:bg-colorPrimaryDark flex justify-center items-center rounded-2xl">
              Supprimer les données
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
