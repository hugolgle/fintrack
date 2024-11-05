import { getInitials } from "../../utils/users";
import { SheetEditProfile } from "../../composant/sheetEditProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "../../composant/header";
import { useCurrentUser } from "../../hooks/user.hooks";
import { Loader } from "lucide-react";
import { formatDate } from "../../utils/fonctionnel";
import { useTheme } from "../../context/ThemeContext";

export default function Profil() {
  const { data: userInfo, isLoading: loadingUser } = useCurrentUser();

  if (loadingUser) return <Loader />;

  const initialName = getInitials(userInfo?.prenom, userInfo?.nom);

  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header title="Profil" />
        <div
          className={`flex-col w-1/2 py-12 mx-auto ${bgColor} flex justify-start items-center rounded-2xl animate-fade gap-1`}
        >
          <div className="relative">
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

          <p className="text-2xl">
            {userInfo?.prenom} {userInfo?.nom}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {userInfo?.username}
          </p>
          {/* <p className="text-xs">
            Inscrit le <b>{formatDate(userInfo?.createdAt, 2)}</b>
          </p> */}
          <SheetEditProfile dataProfil={userInfo} />
        </div>
      </div>
    </section>
  );
}
