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
    isLoading,
    data: dataUser,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });

  if (isLoading) return <Loader />;

  const initialName = getInitials(dataUser?.prenom, dataUser?.nom);

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header title="Profil" isFetching={isFetching} />
        <div className="flex-col w-1/2 py-12 mx-auto bg-secondary/40 flex justify-start items-center rounded-2xl border animate-fade gap-1">
          <div className="relative">
            <Avatar className="w-28 h-28">
              {dataUser?.img ? (
                <img
                  src={dataUser.img}
                  alt="User Avatar"
                  className="object-cover w-full h-full rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <AvatarFallback className="bg-secondary">
                  {initialName}
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          <p className="text-2xl">
            {dataUser?.prenom} {dataUser?.nom}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-500">
            {dataUser?.username}
          </p>
          <SheetEditProfile dataProfil={dataUser} refetch={refetch} />
        </div>
      </div>
    </section>
  );
}
