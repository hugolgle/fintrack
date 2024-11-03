import { useEffect, useState } from "react";

function BoxStat(props) {
  const [currentMontant, setCurrentMontant] = useState(0);
  const [previousMontant, setPreviousMontant] = useState(0);

  const amountAsString = String(props.amount || 0);

  const targetMontant = parseFloat(
    amountAsString.replace(/\s/g, "").replace(",", ".")
  );

  const validTargetMontant = isNaN(targetMontant) ? 0 : targetMontant;

  let bgColor = "";
  if (props.type === "Expense") {
    bgColor = "bg-red-600";
  } else if (props.type === "Revenue") {
    bgColor = "bg-green-600";
  } else if (props.type === "State") {
    bgColor = validTargetMontant >= 0 ? "bg-green-600" : "bg-red-600";
  }

  useEffect(() => {
    let startMontant = previousMontant;
    const duration = 200;
    const stepTime = 10;

    const difference = validTargetMontant - previousMontant;
    const incrementMontant = difference / (duration / stepTime);

    const timer = setInterval(() => {
      startMontant += incrementMontant;
      if (
        (incrementMontant > 0 && startMontant >= validTargetMontant) ||
        (incrementMontant < 0 && startMontant <= validTargetMontant)
      ) {
        setCurrentMontant(validTargetMontant);
        clearInterval(timer);
      } else {
        setCurrentMontant(Math.round(startMontant * 100) / 100);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [validTargetMontant, previousMontant]);

  useEffect(() => {
    setPreviousMontant(currentMontant);
  }, [currentMontant]);

  const formatAmountSign = (amount) => {
    const sign = amount < 0 ? "-" : "";
    const absoluteMontant = Math.abs(amount);

    return (
      sign + absoluteMontant.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    );
  };

  return (
    <div
      className={`w-full flex flex-col-reverse italic gap-10 justify-between font-thin rounded-2xl transition-all px-4 py-2 ${bgColor} hover:bg-opacity-95`}
    >
      <div className="flex justify-between">
        <p className="text-xs text-left">{props.title}</p>
        <p className="text-xs text-left">
          En{" "}
          {props.months ? props.months[parseInt(props.selectedMonth) - 1] : ""}{" "}
          {props.selectedYear}
        </p>
      </div>
      <p className="text-2xl">{formatAmountSign(currentMontant)} €</p>
    </div>
  );
}

export default BoxStat;
