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
import { Skeleton } from "@/components/ui/skeleton";

function Sidebar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const userId = localStorage.getItem("userId");
  const { isAuthenticated, isLoading, isError } = useIsAuthenticated(userId);

  // Utiliser le hook useLogout
  const logoutMutation = useLogout();

  const logout = () => {
    logoutMutation.mutate(); // Appelle la mutation de déconnexion
    toast.success("Vous vous êtes déconnecté !");
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const { data: userInfo, isLoading: loadingUser } = useCurrentUser(userId);
  if (loadingUser) {
    return (
      <div className="flex flex-col justify-between overflow-hidden rounded-full relative items-center h-full p-4 bg-colorSecondaryLight dark:bg-colorPrimaryDark">
        <Link
          to={ROUTES.HOME}
          className="cursor-pointer rounded-t-full text-2xl group text-center h-11 w-auto overflow-hidden"
        >
          <Logo sidebar />
        </Link>

        <div className="flex flex-col justify-between gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-[90%] rounded-full" />
          ))}
        </div>

        <div className="flex flex-col">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>
    );
  }

  const initialName = getInitials(userInfo?.prenom, userInfo?.nom);

  // Menu de la sidebar
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

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-full relative items-center h-full p-4 bg-colorSecondaryLight dark:bg-colorPrimaryDark">
      <Link
        to={ROUTES.HOME}
        className="cursor-pointer rounded-t-full text-2xl group text-center h-11 w-auto overflow-hidden"
      >
        <Logo sidebar />
      </Link>

      <div className="flex flex-col justify-between gap-2">
        {menu.map(({ id, name, link, icon }) => (
          <Tooltip key={id} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to={link}
                className={`my-1 p-3 rounded-full font-thin text-gray-500 hover:text-black dark:hover:text-white overflow-hidden transition-all ${
                  activeLink.startsWith(link)
                    ? "bg-zinc-200 dark:bg-zinc-900 !text-black dark:!text-white"
                    : ""
                }`}
              >
                {icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="rounded-xl">
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="flex flex-col">
        {isAuthenticated ? (
          <DropdownProfil
            btnOpen={
              <Avatar className="w-12 h-12 hover:scale-95 transition-all">
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
            className={`my-1 p-3 rounded-full  hover:bg-opacity-50 hover:dark:bg-opacity-50  transition-all ${
              activeLink.startsWith(ROUTES.LOGIN) ||
              (activeLink.startsWith(ROUTES.SIGNUP) &&
                "bg-zinc-200 dark:bg-zinc-900 !text-black dark:!text-white")
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
