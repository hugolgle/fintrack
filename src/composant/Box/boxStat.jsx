import { useEffect, useState } from "react";

function BoxStat(props) {
  const [currentMontant, setCurrentMontant] = useState(0); // State for animated amount
  const [previousMontant, setPreviousMontant] = useState(0); // State for previous amount

  // Convert props.amount to a number
  const amountAsString = String(props.amount || 0);

  // Clean spaces and convert to number, handling negatives
  const targetMontant = parseFloat(
    amountAsString.replace(/\s/g, "").replace(",", ".")
  );

  // If targetMontant is NaN, default it to 0
  const validTargetMontant = isNaN(targetMontant) ? 0 : targetMontant;

  // Determine background color based on the type
  let bgColor = "";
  if (props.type === "Expense") {
    bgColor = "bg-red-600";
  } else if (props.type === "Revenue") {
    bgColor = "bg-green-600";
  } else if (props.type === "State") {
    bgColor = validTargetMontant >= 0 ? "bg-green-600" : "bg-red-600";
  }

  useEffect(() => {
    // Start animation from previous amount
    let startMontant = previousMontant;
    const duration = 200; // Animation duration in ms
    const stepTime = 10; // Time between increments

    const difference = validTargetMontant - previousMontant; // Difference between previous and target amount
    const incrementMontant = difference / (duration / stepTime);

    const timer = setInterval(() => {
      startMontant += incrementMontant;
      if (
        (incrementMontant > 0 && startMontant >= validTargetMontant) ||
        (incrementMontant < 0 && startMontant <= validTargetMontant)
      ) {
        setCurrentMontant(validTargetMontant); // Set final value
        clearInterval(timer); // Stop interval when target is reached
      } else {
        setCurrentMontant(Math.round(startMontant * 100) / 100); // Round to 2 decimals
      }
    }, stepTime);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [validTargetMontant, previousMontant]);

  useEffect(() => {
    // Update previous amount when target amount changes
    setPreviousMontant(currentMontant);
  }, [currentMontant]);

  // Format amount with spaces for thousands
  const formatMontant = (amount) => {
    const sign = amount < 0 ? "-" : ""; // Preserve negative sign
    const absoluteMontant = Math.abs(amount); // Use absolute value for formatting

    return (
      sign +
      absoluteMontant
        .toFixed(2) // Round to 2 decimals
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ") // Add spaces for thousands
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
      <p className="text-2xl">{formatMontant(currentMontant)} €</p>
    </div>
  );
}

export default BoxStat;
