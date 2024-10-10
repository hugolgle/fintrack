import { useEffect, useState } from "react";

function BoxStat(props) {
  const [currentMontant, setCurrentMontant] = useState(0); // État local pour le amount animé
  const [previousMontant, setPreviousMontant] = useState(0); // État pour le amount précédent

  // Nettoyer les espaces, les virgules et convertir en nombre, tout en prenant en compte les montants négatifs
  const targetMontant = parseFloat(
    props.amount.replace(/\s/g, "").replace(",", ".")
  );

  let bgColor = "";

  if (props.type === "Expense") {
    bgColor = "bg-red-600";
  } else if (props.type === "Revenue") {
    bgColor = "bg-green-600";
  } else if (props.type === "State") {
    bgColor = targetMontant >= 0 ? "bg-green-600" : "bg-red-600";
  }

  useEffect(() => {
    // Démarre l'animation à partir du amount précédent
    let startMontant = previousMontant;
    const duration = 1000; // Durée de l'animation en ms
    const stepTime = 10; // Temps entre chaque incrément

    const difference = targetMontant - previousMontant; // Différence entre le amount précédent et le amount cible
    const incrementMontant = difference / (duration / stepTime);

    const timer = setInterval(() => {
      startMontant += incrementMontant;
      if (
        (incrementMontant > 0 && startMontant >= targetMontant) ||
        (incrementMontant < 0 && startMontant <= targetMontant)
      ) {
        setCurrentMontant(targetMontant); // Fixe la valeur finale
        clearInterval(timer); // Stoppe l'intervalle lorsque le amount est atteint
      } else {
        setCurrentMontant(Math.round(startMontant * 100) / 100); // Arrondit à 2 décimales
      }
    }, stepTime);

    return () => clearInterval(timer); // Nettoyage de l'intervalle lors du démontage du composant
  }, [targetMontant, previousMontant]);

  useEffect(() => {
    // Met à jour le amount précédent lorsque le amount cible change
    setPreviousMontant(currentMontant);
  }, [targetMontant]);

  // Fonction pour formater le amount avec des espaces entre les milliers
  const formatMontant = (amount) => {
    const sign = amount < 0 ? "-" : ""; // Conserver le signe négatif
    const absoluteMontant = Math.abs(amount); // Utiliser la valeur absolue pour le formatage

    return (
      sign +
      absoluteMontant
        .toFixed(2) // Arrondir à 2 décimales
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ") // Ajouter les espaces entre les milliers
    );
  };

  return (
    <div
      className={`w-full flex flex-col-reverse italic gap-10 justify-between font-thin rounded-2xl transition-all px-4 py-2 ${bgColor} bg-opacity-10 hover:bg-opacity-20`}
    >
      <div className="flex justify-between">
        <p className="text-xs text-left">{props.title}</p>
        <p className="text-xs text-left">
          En{" "}
          {props.months ? props.months[parseInt(props.selectedMonth) - 1] : ""}{" "}
          {props.selectedYear}
        </p>
      </div>
      <p className="text-2xl">{formatMontant(currentMontant)} €</p>{" "}
    </div>
  );
}

export default BoxStat;
