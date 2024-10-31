import { getInitials } from "../../utils/users";
import { SheetEditProfile } from "../../composant/sheetEditProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "../../composant/header";
import { useCurrentUser } from "../../hooks/user.hooks";
import { Loader } from "lucide-react";
import { formatDate } from "../../utils/fonctionnel";

export default function Profil() {
  const { data: userInfo, isLoading: loadingUser } = useCurrentUser();

  if (loadingUser) return <Loader />;

  const initialName = getInitials(userInfo?.prenom, userInfo?.nom);

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header title="Profil" />
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
                <b>{userInfo?.prenom}</b>
              </p>
            </div>
            <div>
              <p>Nom :</p>
              <p>
                <b>{userInfo?.nom}</b>
              </p>
            </div>
            <div>
              <p>E-mail :</p>
              <p>
                <b>{userInfo?.username}</b>
              </p>
            </div>
            <div>
              <p>Pseudo :</p>
              <p>
                <b>{userInfo?.pseudo}</b>
              </p>
            </div>
            <div>
              <p>Inscript le :</p>
              <p>
                <b>{formatDate(userInfo?.createdAt, 2)}</b>
              </p>
            </div>
          </div>

          <div className="flex flex-col w-3/4 gap-4">
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
      </div>
    </section>
  );
}
