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
  Cross,
  Group,
  HandCoins,
  LayoutDashboard,
  Power,
  ReceiptCent,
  WalletCards,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { DropdownProfil } from "../pages/profiles/dropDownProfile.jsx";
import { getUserIdFromToken } from "../utils/users.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom/dist/umd/react-router-dom.development";
import { ROUTES } from "./route.jsx";
import { Landmark } from "lucide-react";
import { Swords } from "lucide-react";
import { Coins } from "lucide-react";
import { getCurrentUser, logoutUser } from "../services/user.service.jsx";
import Loader from "./loaders/loader.jsx";

function Sidebar({ btnOpen, isOpen, responsive, setShowResponsiveMenu }) {
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
      group: "first",
      name: "Tableau de bord",
      link: ROUTES.DASHBOARD,
      icon: <LayoutDashboard />,
    },
    {
      id: 2,
      group: "second",
      name: "Finances",
      link: ROUTES.FINANCE,
      icon: <Coins />,
    },
    {
      id: 4,
      group: "second",
      name: "Investissements",
      link: ROUTES.INVESTMENT,
      icon: <HandCoins />,
    },
    {
      id: 5,
      group: "third",
      name: "Épargne",
      link: ROUTES.EPARGN,
      icon: <Landmark />,
    },
    {
      id: 6,
      group: "third",
      name: "Patrimoine",
      link: ROUTES.HERITAGE,
      icon: <Swords />,
    },
    {
      id: 7,
      group: "third",
      name: "Crédits",
      link: ROUTES.CREDIT,
      icon: <CreditCard />,
    },
    {
      id: 8,
      group: "last",
      name: "Statistiques",
      link: ROUTES.STATISTICS,
      icon: <BarChart />,
    },
  ];

  const groupOrder = ["first", "second", "third", "last"];
  const menuByGroup = menu.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  if (responsive) {
    return (
      <div className="fixed inset-0 bg-secondary p-6 z-50 flex flex-col justify-between animate__animated animate-fade-up animate__faster">
        <Link
          to={ROUTES.HOME}
          className="flex items-end cursor-pointer gap-6 text-2xl group text-center w-auto overflow-hidden"
        >
          <img
            src="../../public/logoFinTrack.png"
            className="size-10  hover:scale-95 transition-all"
            alt="logo"
          />
        </Link>
        <X
          size={20}
          className="absolute top-4 right-4 cursor-pointer hover:scale-110 transition-all lg:hidden"
          onClick={() => setShowResponsiveMenu(false)}
        />
        {btnOpen}

        <div className="flex flex-col gap-4 mt-10">
          {menu.map(({ id, name, link, icon }) => (
            <Link
              key={id}
              to={link}
              className={`flex items-center gap-4 p-4 rounded-md text-lg ${
                activeLink.startsWith(link)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {icon}
              <span>{name}</span>
            </Link>
          ))}
        </div>

        <DropdownProfil
          btnOpen={
            <div className="flex items-center gap-4 cursor-pointer">
              <Avatar
                className="size-10 cursor-pointer hover:scale-95 transition-all"
                side="right"
              >
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
              <div className="flex flex-col text-sm text-left truncate">
                <p className="font-bold">
                  {dataUser?.prenom} {dataUser?.nom}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dataUser?.username}
                </p>
              </div>
            </div>
          }
          dataUser={dataUser}
          handleLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-md relative items-center h-full p-4 bg-secondary/40">
      <Link
        to={ROUTES.HOME}
        className="flex items-end cursor-pointer gap-6 text-2xl group text-center w-auto overflow-hidden"
      >
        <img
          src="../../public/logoFinTrack.png"
          className="size-10  hover:scale-95 transition-all"
          alt="logo"
        />
      </Link>
      {btnOpen}
      <div
        className={`flex flex-col justify-between ${!isOpen && "items-center"} gap-1 w-full`}
      >
        {groupOrder.map((groupKey, gi) =>
          menuByGroup[groupKey] ? (
            <div key={groupKey} className={gi > 0 ? "mt-1" : ""}>
              {menuByGroup[groupKey].map(({ id, name, link, icon }) =>
                !isOpen ? (
                  <Tooltip key={id} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        to={link}
                        className={`flex items-center size-12 text-nowrap gap-4 my-1 p-3 rounded-md transition-all ${
                          activeLink.startsWith(link)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {icon}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{name}</TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    key={id}
                    to={link}
                    className={`flex items-center text-nowrap gap-4 my-1 p-3 rounded-md transition-all ${
                      activeLink.startsWith(link)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {icon}
                    <span className="text-sm">{name}</span>
                  </Link>
                )
              )}
            </div>
          ) : null
        )}
      </div>

      <DropdownProfil
        btnOpen={
          <div
            className={`flex items-center ${!isOpen && "justify-center"} gap-4 transition-all cursor-pointer w-full ${isOpen && "p-2 rounded-lg hover:bg-muted"}`}
          >
            <Avatar className="size-10 cursor-pointer hover:scale-95 transition-all">
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
            {isOpen && (
              <div className="flex flex-col text-sm text-left truncate">
                <p className="font-bold">
                  {dataUser?.prenom} {dataUser?.nom}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dataUser?.username}
                </p>
              </div>
            )}
          </div>
        }
        dataUser={dataUser}
        handleLogout={handleLogout}
      />
    </div>
  );
}

export default Sidebar;
