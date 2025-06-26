import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/fonctionnel";
import Container from "../containers/container";
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
    <Container custom="gap-8 px-4 py-2">
      <p className="text-xl text-left italic">
        {formatCurrency.format(currentMontant)}
      </p>

      <p className="text-xs">
        {props.title} en{" "}
        {props.months ? props.months[parseInt(props.selectedMonth) - 1] : ""}{" "}
        {props.selectedYear}
      </p>
    </Container>
  );
}

export default BoxStat;
