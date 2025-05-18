import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInitials, useIsAuthenticated } from "../utils/users.js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  CreditCard,
  HandCoins,
  LayoutDashboard,
  Power,
  ReceiptCent,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
<<<<<<<< HEAD:frontend/src/components/Sidebar.jsx
import { DropdownProfil } from "../Pages/Profile/DropDownProfile.jsx";
import { getUserIdFromToken } from "../utils/users.js";
import { getCurrentUser, logoutUser } from "../Service/User.service.jsx";
========
import { DropdownProfil } from "../pages/Profile/DropDownProfile.jsx";
import { getUserIdFromToken } from "../utils/users";
import { getCurrentUser, logoutUser } from "../service/user.service";
>>>>>>>> origin/vps:frontend/src/composant/Sidebar.jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom/dist/umd/react-router-dom.development";
import { ROUTES } from "./Routes.jsx";
import { Landmark } from "lucide-react";
import { Swords } from "lucide-react";
import Loader from "./loader/loader.jsx";
import { Coins } from "lucide-react";

function Sidebar() {
  const userId = getUserIdFromToken();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const { isAuthenticated } = useIsAuthenticated();
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

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const { data: dataUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });
  if (isLoadingUser) {
    return <Loader />;
  }

  const initialName = getInitials(dataUser?.prenom, dataUser?.nom);

  const menu = [
    {
      id: 1,
      name: "Tableau de bord",
      link: ROUTES.DASHBOARD,
      icon: <LayoutDashboard />,
    },
    {
      id: 2,
      name: "Finances",
      link: ROUTES.FINANCE,
      icon: <Coins />,
    },
    {
      id: 4,
      name: "Investissements",
      link: ROUTES.INVESTMENT,
      icon: <HandCoins />,
    },
    {
      id: 5,
      name: "Épargne",
      link: ROUTES.EPARGN,
      icon: <Landmark />,
    },
    {
      id: 6,
      name: "Patrimoine",
      link: ROUTES.HERITAGE,
      icon: <Swords />,
    },
    {
      id: 7,
      name: "Crédits",
      link: ROUTES.CREDIT,
      icon: <CreditCard />,
    },
    {
      id: 8,
      name: "Statistiques",
      link: ROUTES.STATISTICS,
      icon: <BarChart />,
    },
  ];

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-md relative items-center h-full p-4 bg-secondary/40">
      <Link
        to={ROUTES.HOME}
        className="cursor-pointer text-2xl group text-center w-auto overflow-hidden"
      >
        <img
          src="/public/logoFinTrack.png"
          className="size-10  hover:scale-95 transition-all"
          alt="logo"
        />
      </Link>

      <div className="flex flex-col justify-between gap-1">
        {menu.map(({ id, name, link, icon }) => (
          <Tooltip key={id} delayDuration={false}>
            <TooltipTrigger asChild>
              <Link
                to={link}
                className={`my-1 p-3 rounded-md overflow-hidden transition-all ${
                  activeLink.startsWith(link)
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                {icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{name}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="flex flex-col">
        {isAuthenticated ? (
          <DropdownProfil
            btnOpen={
              <Avatar className="w-12 h-12 cursor-pointer hover:scale-95 transition-all">
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
            }
            handleLogout={handleLogout}
          />
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className={`my-1 p-3 font-thin text-muted-foreground hover:text-black dark:hover:text-white overflow-hidden transition-all ${
              activeLink.startsWith(ROUTES.LOGIN) ||
              activeLink.startsWith(ROUTES.SIGNUP)
                ? "text-black dark:text-white"
                : ""
            }`}
          >
            <Power />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
