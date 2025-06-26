import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../components/route.jsx";

function PageError() {
  return (
    <section className="w-full h-screen">
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
    </section>
  );
}

export default PageError;
