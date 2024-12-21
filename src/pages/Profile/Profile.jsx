import { getInitials } from "../../utils/users.js";
import { SheetEditProfile } from "./SheetEditProfile.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "../../composant/Header.jsx";
import { Loader } from "lucide-react";
import { getUserIdFromToken } from "../../utils/users.js";
import { getCurrentUser } from "../../Service/User.service.jsx";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const userId = getUserIdFromToken();

  const {
    data: userInfo,
    isLoading: loadingUser,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });

  if (loadingUser) return <Loader />;

  const initialName = getInitials(userInfo?.prenom, userInfo?.nom);

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header title="Profil" isFetching={isFetching} />
        <div className="flex-col w-1/2 py-12 mx-auto bg-secondary flex justify-start items-center rounded-2xl animate-fade gap-1">
          <div className="relative">
            <Avatar className="w-28 h-28">
              <AvatarImage
                className="object-cover"
                src={`http://localhost:5001/${userInfo?.img}`}
              />
              <AvatarFallback className="bg-secondary">
                {initialName}
              </AvatarFallback>
            </Avatar>
          </div>

          <p className="text-2xl">
            {userInfo?.prenom} {userInfo?.nom}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-500">
            {userInfo?.username}
          </p>
          <SheetEditProfile dataProfil={userInfo} refetch={refetch} />
        </div>
      </div>
    </section>
  );
}
