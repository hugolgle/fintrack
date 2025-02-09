import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/fonctionnel";
import { ChevronRight } from "lucide-react";
function BoxStat(props) {
  const [currentMontant, setCurrentMontant] = useState(0);
  const [previousMontant, setPreviousMontant] = useState(0);

  useEffect(() => {
    let startMontant = previousMontant;
    const duration = 200;
    const stepTime = 10;

    const difference = props.amount - previousMontant;
    const incrementMontant = difference / (duration / stepTime);

    const timer = setInterval(() => {
      startMontant += incrementMontant;
      if (
        (incrementMontant > 0 && startMontant >= props.amount) ||
        (incrementMontant < 0 && startMontant <= props.amount)
      ) {
        setCurrentMontant(props.amount);
        clearInterval(timer);
      } else {
        setCurrentMontant(Math.round(startMontant * 100) / 100);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [props.amount, previousMontant]);

  useEffect(() => {
    setPreviousMontant(currentMontant);
  }, [currentMontant]);

  return (
    <div className="w-full flex flex-col italic gap-10 justify-between font-thin rounded-2xl border bg-secondary/40 transition-all px-4 py-2 hover:bg-opacity-95">
      <p className="text-xl text-left">
        {formatCurrency.format(currentMontant)}
      </p>

      <p className="text-xs">
        {props.title} en{" "}
        {props.months ? props.months[parseInt(props.selectedMonth) - 1] : ""}{" "}
        {props.selectedYear}
      </p>
    </div>
  );
}

export default BoxStat;
