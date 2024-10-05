import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { months } from "../utils/fonctionnel";

export function BreadcrumbDemo() {
  const location = useLocation();

  const pathParts = location.pathname.split("/").filter(Boolean);

  const pathMap = {
    "/": "Home",
    "/depense": "Board Dépense",
    "/depense/add": "Ajouter",
    "/depense/:date": "Transactions Dépenses",
    "/depense/:date/:id": "Dépense Détails",
    "/recette": "Board Recette",
    "/recette/add": "Ajouter",
    "/recette/:date": "Transactions Recettes",
    "/recette/:date/:id": "Recette Détails",
    "/invest": "Investissements",
    "/invest/add": "Ajouter",
    "/invest/:urlInvest": "Détails Investissement",
    "/invest/:urlInvest/:id": "Investissement Détails",
    "/tdb": "Tableau de Bord",
    "/stat": "Statistiques",
    "/profil": "Profil",
    "/connexion": "Connexion",
    "/inscription": "Inscription",
    "/session-timed-out": "Session expirée",
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
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

          // Vérifier si c'est le dernier élément du chemin
          const isLast = index === pathParts.length - 1;

          return (
            <BreadcrumbItem key={index}>
              {isLast ? (
                // Dernier élément non cliquable
                <BreadcrumbPage>{displayName}</BreadcrumbPage>
              ) : (
                // Autres éléments cliquables
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
