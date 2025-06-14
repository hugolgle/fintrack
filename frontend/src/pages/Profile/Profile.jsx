import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Header from "../../components/Header.jsx";
import { Award, Download, Loader, MessageSquare } from "lucide-react";
import { getUserIdFromToken } from "../../utils/users.js";
import { getCurrentUser, logoutUser } from "../../Service/User.service.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";

import { LogOutIcon, SettingsIcon, ShieldIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "../../components/Container/Container.jsx";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ROUTES } from "../../components/Routes.jsx";
import TabProfil from "./Tabs/TabProfil.jsx";
import TabSettings from "./Tabs/TabSettings.jsx";
import TabSecurity from "./Tabs/TabSecurity.jsx";
import TabSupport from "./Tabs/TabSupport.jsx";
import TabExportation from "./Tabs/TabExportation.jsx";
import TabAccount from "./Tabs/TabAccount.jsx";

export default function Profile() {
  const userId = getUserIdFromToken();
  const queryClient = useQueryClient();

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

  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      sessionStorage.removeItem("token");
      queryClient.clear();
      navigate(ROUTES.LOGIN);
      toast.success("Vous vous êtes déconnecté !");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleLogout = () => {
    mutate();
  };

  const [activeTab, setActiveTab] = useState("profil");

  if (isLoading) return <Loader />;

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header title="Profil" isFetching={isFetching} />

        <main>
          <div className="grid gap-4 md:grid-cols-[1fr_3fr] animate-fade">
            <Container custom="h-fit">
              <div className="flex flex-row items-center gap-4 p-4 mb-4">
                <Avatar className="size-16">
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
                <div className="text-left">
                  <CardTitle className="text-2xl font-bold">
                    {dataUser?.prenom} {dataUser?.nom}
                  </CardTitle>
                  <CardDescription>{dataUser?.username}</CardDescription>
                </div>
              </div>
              <CardContent>
                <nav className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    className={`justify-start ${activeTab === "profil" && "bg-muted"}`}
                    onClick={() => setActiveTab("profil")}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    Mon profil
                  </Button>

                  <Button
                    variant="ghost"
                    className={`justify-start ${activeTab === "account" && "bg-muted"}`}
                    onClick={() => setActiveTab("account")}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Mon compte
                  </Button>

                  <Button
                    variant="ghost"
                    className={`justify-start ${activeTab === "settings" && "bg-muted"}`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Paramètres
                  </Button>

                  <Button
                    variant="ghost"
                    className={`justify-start ${activeTab === "securite" && "bg-muted"}`}
                    onClick={() => setActiveTab("securite")}
                  >
                    <ShieldIcon className="mr-2 h-4 w-4" />
                    Sécurité
                  </Button>
                  <Button
                    variant="ghost"
                    className={`justify-start ${activeTab === "support" && "bg-muted"}`}
                    onClick={() => setActiveTab("support")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Support
                  </Button>
                  <Button
                    variant="ghost"
                    className={`justify-start ${activeTab === "exportation" && "bg-muted"}`}
                    onClick={() => setActiveTab("exportation")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Exportation
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </nav>
              </CardContent>
            </Container>

            <div>
              {activeTab === "profil" && (
                <TabProfil dataUser={dataUser} refetch={refetch} />
              )}
              {activeTab === "settings" && <TabSettings />}
              {activeTab === "securite" && <TabSecurity />}
              {activeTab === "support" && <TabSupport />}
              {activeTab === "exportation" && <TabExportation />}
              {activeTab === "account" && (
                <TabAccount dataUser={dataUser} refetch={refetch} />
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
