import { useSelector } from "react-redux";

export function isConnected() {
  const userAutenticate = useSelector(
    (state) => state.userReducer?.isAuthenticated
  );
  return userAutenticate;
}

export function infoUser() {
  const infoUser = useSelector((state) => state.userReducer?.user);
  return infoUser;
}

export function getInitials(prenom = "", nom = "") {
  const initialPrenom = prenom?.charAt(0)?.toUpperCase() || ""; // Assure que prenom n'est pas null ou undefined
  const initialNom = nom?.charAt(0)?.toUpperCase() || ""; // Assure que nom n'est pas null ou undefined

  return `${initialPrenom}${initialNom}`; // Retourne les initiales combinées
}
