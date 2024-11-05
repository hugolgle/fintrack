import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { ROUTES } from "./routes";
import { months } from "../utils/other";

export function BreadcrumbDemo() {
  const location = useLocation();

  const pathParts = location.pathname.split("/").filter(Boolean);

  const pathMap = {
    [ROUTES.HOME]: "Home",
    [ROUTES.EXPENSE]: "Board Dépense",
    [ROUTES.ADD_EXPENSE]: "Ajouter",
    [ROUTES.EXPENSE_BY_DATE]: "Transactions Dépenses",
    [ROUTES.EXPENSE_BY_ID]: "Dépense Détails",
    [ROUTES.REVENUE]: "Board Recette",
    [ROUTES.ADD_REVENUE]: "Ajouter",
    [ROUTES.REVENUE_BY_DATE]: "Transactions Recettes",
    [ROUTES.REVENUE_BY_ID]: "Recette Détails",
    [ROUTES.INVESTMENT]: "Investissements",
    [ROUTES.ADD_INVEST]: "Ajouter",
    [ROUTES.INVESTMENT_BY_STATUS]: "Détails Investissement",
    [ROUTES.INVESTMENT_BY_ID]: "Investissement Détails",
    [ROUTES.DASHBOARD]: "Tableau de Bord",
    [ROUTES.STATISTICS]: "Statistiques",
    [ROUTES.PROFILE]: "Profil",
    [ROUTES.BRANDING]: "Marque",
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
          let displayName =
            pathMap[href] || part.charAt(0).toUpperCase() + part.slice(1);

          if (/^\d{6}$/.test(part)) {
            const year = part.slice(0, 4);
            const monthIndex = parseInt(part.slice(4), 10) - 1;
            displayName = `${months[monthIndex]} ${year}`;
          } else if (/^[0-9a-fA-F]{24}$/.test(part)) {
            displayName = part.slice(0, 4);
          }

          const isLast = index === pathParts.length - 1;

          return (
            <BreadcrumbItem key={index}>
              {isLast ? (
                <BreadcrumbPage>{displayName}</BreadcrumbPage>
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
