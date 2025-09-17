export function getInitials(prenom = "", nom = "") {
  const initialPrenom = prenom.charAt(0).toUpperCase();
  const initialNom = nom.charAt(0).toUpperCase();

  return `${initialPrenom}${initialNom}`;
}
