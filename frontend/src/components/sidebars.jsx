import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { DropdownProfil } from "../pages/profiles/dropDownProfile.jsx";
import { ROUTES } from "./route.jsx";
import { Landmark } from "lucide-react";
import { Swords } from "lucide-react";
import { Coins } from "lucide-react";
import Loader from "./loaders/loader.jsx";
import { useAuth } from "../context/authContext.jsx";

function Sidebar({ btnOpen, isOpen, responsive, setShowResponsiveMenu }) {
  const { user: dataUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [animateFadeOut, setAnimateFadeOut] = useState(false);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const initialName = getInitials(dataUser?.prenom, dataUser?.nom);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

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
      <div
        className={`fixed w-fit inset-0 bg-secondary rounded-r-md p-6 z-50 flex flex-col justify-between items-center animate__animated animate__fadeInLeft animate__faster ${animateFadeOut && "animate__animated animate__fadeOutLeft"}`}
      >
        <Link
          to={ROUTES.HOME}
          className="flex items-end cursor-pointer gap-6 mt-10 text-center w-auto overflow-hidden"
        >
          <img
            src="/logoFinTrack.png"
            className="size-5  hover:scale-95 transition-all"
            alt="logo"
          />
        </Link>
        <X
          size={20}
          className="absolute top-4 left-4 lg:hidden"
          onClick={() => {
            setAnimateFadeOut(true);
            setTimeout(() => setShowResponsiveMenu(false), 500);
          }}
        />
        {btnOpen}

        <div className="flex flex-col gap-4 mt-10">
          {groupOrder.map((groupKey, gi) =>
            menuByGroup[groupKey] ? (
              <div key={groupKey} className={gi > 0 ? "mt-1" : ""}>
                {menuByGroup[groupKey].map(({ id, name, link, icon }) => (
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
                  </Link>
                ))}
              </div>
            ) : null
          )}
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
          src="/logoFinTrack.png"
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
