import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions/user.action";
import { infoUser, isConnected } from "../utils/users";
import { BtnTheme } from "./Button/btnTheme";
import {
  BarChart,
  ChevronLeft,
  Euro,
  HandCoins,
  LayoutDashboard,
  Power,
  PowerOff,
  WalletCards,
} from "lucide-react";
import { MessageContext } from "@/context/MessageContext";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

export default function Navbar(props: any) {
  const messageContext = useContext(MessageContext);
  if (!messageContext) {
    throw new Error("MyComponent must be used within a MessageProvider");
  }
  const { showMessage } = messageContext;

  const navigate = useNavigate();
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const isAuthenticated = isConnected();

  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [selectedLogout, setSelectedLogout] = useState(false);
  const [wrapMenu, setWrapMenu] = useState(true);

  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
    setSelectedLogout(false);
    showMessage("Vous vous êtes déconnecté !", "bg-red-500");
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleWrap = () => setWrapMenu(!wrapMenu);

  const userInfo = infoUser();

  const imagePp = () => (
    <>
      <div
        className={`rounded-full w-12 h-12 hover:scale-90 overflow-hidden transition-all ${activeLink.startsWith("/profil") ? "scale-90" : ""}`}
      >
        <img
          src={
            userInfo?.img
              ? `http://localhost:5001/${userInfo?.img}`
              : "../public/img/imgProfil.svg"
          }
          alt="PP"
          className="object-cover h-full w-full"
        />
      </div>
    </>
  );

  return (
    <section className="h-screen w-full flex">
      <div
        className={`sidebar flex flex-col justify-between overflow-hidden rounded-r-[18px] items-center h-screen py-10 px-4 bg-zinc-100 dark:bg-zinc-900 fixed ease-linear duration-300 ${wrapMenu ? "w-1/12" : "w-1/5"}`}
      >
        <Link
          to="/"
          className="font-logo cursor-pointer text-2xl group text-center w-auto overflow-hidden"
        >
          <div className="flex justify-center items-center cursor-pointer tracking-tight">
            <p className="p-2 bg-transparent dark:bg-white cursor-pointer text-zinc-900 dark:text-zinc-900 group-hover:bg-zinc-900 text-nowrap group-hover:dark:bg-transparent group-hover:text-white group-hover:dark:text-white transition-all">
              {wrapMenu ? "D" : "D A S H"}
            </p>
            <p className="p-2 bg-zinc-900 dark:bg-transparent cursor-pointer text-white dark:text-white group-hover:bg-transparent text-nowrap group-hover:dark:bg-white group-hover:text-zinc-900 group-hover:dark:text-zinc-900 transition-all">
              {wrapMenu ? "C" : "C A S H"}
            </p>
          </div>
        </Link>
        <BtnTheme />

        <ChevronLeft
          size={40}
          onClick={handleWrap}
          className={`bg-zinc-200 p-2 dark:bg-zinc-800 hover:bg-opacity-50 hover:scale-105 hover:dark:bg-opacity-50 rounded-full cursor-pointer ease-linear duration-300 ${wrapMenu ? "rotate-180" : ""}`}
        />

        <div
          className={`flex flex-col justify-between ${wrapMenu ? " items-center" : ""} gap-4 w-full`}
        >
          <Link
            to="/tdb"
            className={`my-1 py-2 rounded text-nowrap hover:bg-opacity-50 hover:dark:bg-opacity-50 overflow-hidden transition-all ${wrapMenu ? "p-2" : ""} ${activeLink.startsWith("/tdb") ? "bg-zinc-300 dark:bg-zinc-700" : "bg-zinc-200 dark:bg-zinc-800"}`}
          >
            {wrapMenu ? <LayoutDashboard /> : "Tableau de bord"}
          </Link>
          <div className="flex flex-col">
            <Link
              to="/depense"
              className={`my-1 py-2 rounded hover:bg-opacity-50 hover:dark:bg-opacity-50 overflow-hidden transition-all ${wrapMenu ? "p-2" : ""} ${activeLink.startsWith("/depense") ? "bg-zinc-300 dark:bg-zinc-700" : "bg-zinc-200 dark:bg-zinc-800"}`}
            >
              {wrapMenu ? <WalletCards /> : "Dépenses"}
            </Link>
            <Link
              to="/recette"
              className={`my-1 py-2 rounded hover:bg-opacity-50 hover:dark:bg-opacity-50 overflow-hidden transition-all ${wrapMenu ? "p-2" : ""} ${activeLink.startsWith("/recette") ? "bg-zinc-300 dark:bg-zinc-700" : "bg-zinc-200 dark:bg-zinc-800"}`}
            >
              {wrapMenu ? <Euro /> : "Recettes"}
            </Link>
          </div>
          <div className="flex flex-col">
            <Link
              to="/invest"
              className={`my-1 py-2 rounded text-nowrap hover:bg-opacity-50 hover:dark:bg-opacity-50 overflow-hidden transition-all ${wrapMenu ? "p-2" : ""} ${activeLink.startsWith("/invest") ? "bg-zinc-300 dark:bg-zinc-700" : "bg-zinc-200 dark:bg-zinc-800"}`}
            >
              {wrapMenu ? <HandCoins /> : "Investissements"}
            </Link>
          </div>
          <Link
            to="/stat"
            className={`my-1 py-2 rounded text-nowrap hover:bg-opacity-50 hover:dark:bg-opacity-50 overflow-hidden transition-all ${wrapMenu ? "p-2" : ""} ${activeLink.startsWith("/stat") ? "bg-zinc-300 dark:bg-zinc-700" : "bg-zinc-200 dark:bg-zinc-800"}`}
          >
            {wrapMenu ? <BarChart /> : "Stats"}
          </Link>
        </div>

        <div
          className={`flex flex-col justify-end ${wrapMenu ? " items-center" : ""} h-32 w-full`}
        >
          {isAuthenticated && (
            <Link
              to="/profil"
              className={`my-1 py-2 rounded text-nowrap ${wrapMenu ? "bg-transparent" : activeLink.startsWith("/profil") ? "bg-zinc-300 dark:bg-zinc-700" : "bg-zinc-200 dark:bg-zinc-800"} hover:bg-opacity-50 hover:dark:bg-opacity-50 overflow-hidden transition-all ${wrapMenu ? "p-2" : ""}`}
            >
              {wrapMenu ? imagePp() : "Profil"}
            </Link>
          )}

          {isAuthenticated === false ? (
            <Link
              to="/connexion"
              className={`my-1 py-2 rounded text-nowrap bg-green-500 dark:bg-green-500 hover:bg-opacity-50 hover:dark:bg-opacity-50 overflow-hidden transition-all ${wrapMenu ? "p-2" : ""} ${activeLink.startsWith("/connexion") ? "bg-zinc-300 dark:bg-zinc-700" : "bg-zinc-200 dark:bg-zinc-800"}`}
            >
              {wrapMenu ? <Power /> : "Connexion"}
            </Link>
          ) : selectedLogout ? (
            <div className="flex flex-col justify-center items-center">
              <p className="text-sm py-1">Êtes-vous sûr ?</p>
              <div className="flex justify-center gap-4 w-full">
                <div
                  className="p-1 w-full text-sm border-2 border-red-900 bg-opacity-20 rounded cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95"
                  onClick={logout}
                >
                  Oui
                </div>
                <div
                  className="p-1 w-full text-sm border-2 border-zinc-900 bg-opacity-20 rounded cursor-pointer flex justify-center items-center transition-all hover:bg-opacity-80 hover:scale-95 hover:border-green-900"
                  onClick={() => setSelectedLogout(false)}
                >
                  Non
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setSelectedLogout(true)}
              className={`my-1 py-2 rounded bg-red-500 dark:bg-red-500 cursor-pointer text-nowrap dark:text-slate-50 hover:bg-opacity-50 hover:dark:bg-opacity-50 overflow-hidden transition-all ${wrapMenu ? "p-2" : ""}`}
            >
              {wrapMenu ? <PowerOff /> : "Déconnexion"}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-nowrap absolute bottom-2">
          {wrapMenu
            ? "© HLG - DC v2.0.0"
            : "© Hugo Le Galle - DashCash v2.0.0"}
        </p>
      </div>

      <div
        className={`relative content ml-auto ease-linear duration-300 p-4 ${wrapMenu ? "w-11/12" : "w-4/5"}`}
      >
        <Outlet />
        {props.children}
      </div>
    </section>
  );
}
