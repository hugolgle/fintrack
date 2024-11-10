import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../composant/routes";

function PageError() {
  return (
    <div className="flex flex-col items-center h-full justify-center">
      <h1 className="text-5xl font-bold mb-4">ERREUR 404</h1>
      <p className="text-xl mb-6">
        Désolé, la page que vous recherchez est introuvable.
      </p>
      <Link
        to={ROUTES.HOME}
        className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default PageError;
