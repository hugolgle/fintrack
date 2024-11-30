import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInitials, useIsAuthenticated } from "../utils/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  HandCoins,
  LayoutDashboard,
  Power,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { DropdownProfil } from "../Pages/Profile/DropDownProfile.jsx";
import { getUserIdFromToken } from "../utils/users";
import { getCurrentUser, logoutUser } from "../Service/User.service";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom/dist/umd/react-router-dom.development";
import { DollarSign } from "lucide-react";
import { ROUTES } from "./Routes.jsx";
import { Landmark } from "lucide-react";
import { Swords } from "lucide-react";

function Sidebar() {
  const userId = getUserIdFromToken();
  const queryClient = new QueryClient();
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

  const { data: userInfo, isLoading: loadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });
  if (loadingUser) {
    return null;
  }

  const initialName = getInitials(userInfo?.prenom, userInfo?.nom);

  const menu = [
    {
      id: 1,
      name: "Tableau de bord",
      link: ROUTES.DASHBOARD,
      icon: <LayoutDashboard />,
    },
    {
      id: 2,
      name: "Dépenses",
      link: ROUTES.EXPENSE,
      icon: <WalletCards />,
    },
    {
      id: 3,
      name: "Revenus",
      link: ROUTES.REVENUE,
      icon: <DollarSign />,
    },
    {
      id: 4,
      name: "Investissements",
      link: ROUTES.INVESTMENT,
      icon: <HandCoins />,
    },
    {
      id: 4,
      name: "Épargne",
      link: ROUTES.EPARGN,
      icon: <Landmark />,
    },
    {
      id: 5,
      name: "Patrimoine",
      link: ROUTES.HERITAGE,
      icon: <Swords />,
    },
    {
      id: 6,
      name: "Statistiques",
      link: ROUTES.STATISTICS,
      icon: <BarChart />,
    },
  ];

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-full relative items-center h-full p-4 bg-primary-foreground">
      <Link
        to={ROUTES.HOME}
        className="cursor-pointer rounded-xl text-2xl group text-center w-auto overflow-hidden"
      >
        <img
          src="/public/logoFinTrack.png"
          className="size-10 hover:scale-95 transition-all"
          alt="logo"
        />
      </Link>

      <div className="flex flex-col justify-between gap-1">
        {menu.map(({ id, name, link, icon }) => (
          <Tooltip key={id} delayDuration={false}>
            <TooltipTrigger asChild>
              <Link
                to={link}
                className={`my-1 p-3 rounded-full overflow-hidden transition-all ${
                  activeLink.startsWith(link)
                    ? "bg-primary text-foreground"
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
                <AvatarImage
                  className="object-cover"
                  src={`http://localhost:5001/${userInfo?.img}`}
                />
                <AvatarFallback className="bg-secondary">
                  {initialName}
                </AvatarFallback>
              </Avatar>
            }
            handleLogout={handleLogout}
          />
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className={`my-1 p-3 rounded-xl font-thin text-gray-500 hover:text-black dark:hover:text-white overflow-hidden transition-all ${
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
