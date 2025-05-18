import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { ROUTES } from "./Routes";
import { months } from "../utils/other";

export function BreadcrumbDemo() {
  const location = useLocation();

  const pathParts = location.pathname.split("/").filter(Boolean);

  const pathMap = {
    [ROUTES.HOME]: "Home",
    [ROUTES.DASHBOARD]: "Tableau de Bord",
    [ROUTES.EXPENSE]: "Board Dépense",
    [ROUTES.ADD_EXPENSE]: "Ajouter",
    [ROUTES.EXPENSE_BY_DATE]: "Transactions Dépenses",
    [ROUTES.REVENUE]: "Board Recette",
    [ROUTES.ADD_REVENUE]: "Ajouter",
    [ROUTES.REVENUE_BY_DATE]: "Transactions Recettes",
    [ROUTES.INVESTMENT]: "Investissements",
    [ROUTES.ADD_ORDER]: "Ajouter un ordre",
    [ROUTES.ADD_INVESTMENT]: "Ajouter un investissement",
    [ROUTES.INVESTMENT_BY_ID]: "Investissement Détails id",
    [ROUTES.INVESTMENT_ORDER]: "Mes ordres",
    [ROUTES.EPARGN]: "Épargne",
    [ROUTES.ACCOUNT_BY_ID]: "Compte Id",
    [ROUTES.ACCOUNT_TRANSACTION]: "Transaction du compte",
    [ROUTES.ACTION_EPARGN]: "Action",
    [ROUTES.ADD_ACCOUNT]: "Ajouter un compte",
    [ROUTES.ADD_TRANSFERT]: "Faire un transfert",
    [ROUTES.ADD_DEPOSIT]: "Faire un dépôt",
    [ROUTES.ADD_WITHDRAW]: "Faire un retrait",
    [ROUTES.HERITAGE]: "Patrimoine",
    [ROUTES.STATISTICS]: "Statistiques",
    [ROUTES.PROFILE]: "Profil",
    [ROUTES.LOGIN]: "Connexion",
    [ROUTES.SIGNUP]: "Inscription",
    [ROUTES.SESSION_TIMED_OUT]: "Session expirée",
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs">
        <BreadcrumbItem>
          <BreadcrumbLink href={ROUTES.HOME}>Accueil</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {pathParts.map((part, index) => {
          const href = `/${pathParts.slice(0, index + 1).join("/")}`;

          if (/^\d+$/.test(part)) {
            return null;
          }

          let displayName =
            pathMap[href] || part.charAt(0).toUpperCase() + part.slice(1);

          if (/^\d{6}$/.test(part)) {
            const year = part.slice(0, 4);
            const monthIndex = parseInt(part.slice(4), 10) - 1;
            displayName = `${months[monthIndex]} ${year}`;
          }

          const isLast = index === pathParts.length - 1;

          return (
            <BreadcrumbItem key={index}>
              {isLast ? (
                <BreadcrumbPage>
                  {displayName === "All" ? "Tout" : displayName}
                </BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href={href}>{displayName}</BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
