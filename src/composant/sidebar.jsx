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
  Euro,
  HandCoins,
  LayoutDashboard,
  Power,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { DropdownProfil } from "./dropDownProfil";
import Logo from "./logo";
import { ROUTES } from "./routes";
import { useCurrentUser, useLogout } from "../hooks/user.hooks";
import { useTheme } from "../context/ThemeContext";

function Sidebar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const { isAuthenticated } = useIsAuthenticated();

  const logoutMutation = useLogout();

  const logout = () => {
    logoutMutation.mutate();
    toast.success("Vous vous êtes déconnecté !");
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const { data: userInfo, isLoading: loadingUser } = useCurrentUser();
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
      name: "Board dépense",
      link: ROUTES.EXPENSE,
      icon: <WalletCards />,
    },
    {
      id: 3,
      name: "Board recette",
      link: ROUTES.REVENUE,
      icon: <Euro />,
    },
    {
      id: 4,
      name: "Board investissement",
      link: ROUTES.INVESTMENT,
      icon: <HandCoins />,
    },
    {
      id: 5,
      name: "Statistiques",
      link: ROUTES.STATISTICS,
      icon: <BarChart />,
    },
  ];

  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";

  const bgColorSecondary =
    theme === "custom"
      ? "bg-colorSecondaryCustom"
      : "bg-colorSecondaryLight dark:bg-colorSecondaryDark";

  return (
    <div
      className={`flex flex-col justify-between overflow-hidden rounded-2xl relative items-center h-full p-4 ${bgColor}`}
    >
      <Link
        to={ROUTES.HOME}
        className="cursor-pointer rounded-xl text-2xl group text-center h-11 w-auto overflow-hidden"
      >
        <Logo sidebar />
      </Link>

      <div className="flex flex-col justify-between gap-2">
        {menu.map(({ id, name, link, icon }) => (
          <Tooltip key={id} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to={link}
                className={`my-1 p-3 rounded-xl font-thin text-gray-500 hover:text-black dark:hover:text-white overflow-hidden transition-all ${
                  activeLink.startsWith(link)
                    ? `${bgColorSecondary} text-black dark:text-white`
                    : ""
                }`}
              >
                {icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="flex flex-col">
        {isAuthenticated ? (
          <DropdownProfil
            btnOpen={
              <Avatar className="w-12 h-12 rounded-xl hover:scale-95 transition-all">
                <AvatarImage
                  className="object-cover"
                  src={`http://localhost:5001/${userInfo?.img}`}
                />
                <AvatarFallback className="bg-colorPrimaryLight dark:bg-colorSecondaryDark">
                  {initialName}
                </AvatarFallback>
              </Avatar>
            }
            handleLogout={logout}
          />
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className={`my-1 p-3 rounded-xl font-thin text-gray-500 hover:text-black dark:hover:text-white overflow-hidden transition-all ${
              activeLink.startsWith(ROUTES.LOGIN) ||
              activeLink.startsWith(ROUTES.SIGNUP)
                ? `${bgColorSecondary} text-black dark:text-white`
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
