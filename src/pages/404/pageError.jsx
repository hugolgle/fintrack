import React from "react";
import { Link } from "react-router-dom";

function PageError() {
  return (
    <>
      <div>Page introuvable</div>
      <br />
      <Link to="/">Retour à l'accueil</Link>
    </>
  );
}

export default PageError;
