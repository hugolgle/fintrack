import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../composant/routes";

function PageError() {
  return (
    <>
      <div>Page introuvable</div>
      <br />
      <Link to={ROUTES.HOME}>Retour à l'accueil</Link>
    </>
  );
}

export default PageError;
