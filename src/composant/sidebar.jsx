import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions/user.action";
import { getInitials, infoUser, isConnected } from "../utils/users";
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
import { versionApp } from "../utils/other";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = isConnected();

  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
    toast.success("Vous vous êtes déconnecté !");
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const userInfo = infoUser();
  const initialName = getInitials(userInfo?.prenom, userInfo?.nom);

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-full relative items-center h-full p-4 bg-colorSecondaryLight dark:bg-colorPrimaryDark">
      <Link
        to="/"
        className="cursor-pointer rounded-t-full text-2xl group text-center h-11 w-auto overflow-hidden"
      >
        <Logo sidebar />
      </Link>

      <div className="flex flex-col justify-between gap-4">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              to="/tdb"
              className={`my-1 p-3 rounded-full font-thin text-gray-500 hover:text-black dark:hover:text-white overflow-hidden transition-all ${
                activeLink.startsWith("/tdb") &&
                "bg-zinc-200 dark:bg-zinc-900 !text-black dark:!text-white"
              }`}
            >
              <LayoutDashboard />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="rounded-xl">
            <p>Tableau de bord</p>
          </TooltipContent>
        </Tooltip>
        <div className="flex flex-col">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to="/depense"
                className={`my-1 p-3 rounded-full font-thin text-gray-500 hover:text-black dark:hover:text-white overflow-hidden transition-all ${
                  activeLink.startsWith("/depense") &&
                  "bg-zinc-200 dark:bg-zinc-900 !text-black dark:!text-white"
                }`}
              >
                <WalletCards />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="rounded-xl">
              <p>Board dépense</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to="/recette"
                className={`my-1 p-3 rounded-full font-thin text-gray-500 hover:text-black dark:hover:text-white overflow-hidden transition-all ${
                  activeLink.startsWith("/recette") &&
                  "bg-zinc-200 dark:bg-zinc-900 !text-black dark:!text-white"
                }`}
              >
                <Euro />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="rounded-xl">
              <p>Board recette</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-col">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to="/invest"
                className={`my-1 p-3 rounded-full font-thin text-gray-500 hover:text-black dark:hover:text-white overflow-hidden transition-all ${
                  activeLink.startsWith("/invest") &&
                  "bg-zinc-200 dark:bg-zinc-900 !text-black dark:!text-white"
                }`}
              >
                <HandCoins />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="rounded-xl">
              <p>Board investissement</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              to="/stat"
              className={`my-1 p-3 rounded-full font-thin text-gray-500 hover:text-black dark:hover:text-white overflow-hidden transition-all ${
                activeLink.startsWith("/stat") &&
                "bg-zinc-200 dark:bg-zinc-900 !text-black dark:!text-white"
              }`}
            >
              <BarChart />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="rounded-xl">
            <p>Stats</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-col">
        {isAuthenticated === true ? (
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
            to="/connexion"
            className={`my-1 p-3 rounded-full  hover:bg-opacity-50 hover:dark:bg-opacity-50  transition-all ${
              activeLink.startsWith("/connexion") ||
              (activeLink.startsWith("/inscription") &&
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
