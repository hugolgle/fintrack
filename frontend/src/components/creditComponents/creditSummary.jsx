import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "../../utils/fonctionnel";
import { useAmountVisibility } from "../../context/AmountVisibilityContext";

export function CreditSummary({ credit }) {
  const { isVisible } = useAmountVisibility();
  const amount = Number(credit?.amount) || 0;
  const remaining = Number(credit?.balance) || 0;
  const monthly = Number(credit?.monthlyPayment) || 0;
  const rate = Number(credit?.interestRate) || 0;
  const duration = Number(credit?.duration) || 0;
  const insurance = Number(credit?.insurance) || 0;
  const amountPayed =
    Number(
      credit?.transactions?.reduce(
        (acc, transaction) => acc + (Number(transaction.amount) || 0),
        0
      )
    ) || 0;

  const progressPercentage =
    amount > 0 ? ((amount - remaining) / amount) * 100 : 0;

  const start = credit?.startDate ? new Date(credit?.startDate) : null;
  const end =
    start && duration
      ? new Date(
          start.getFullYear(),
          start.getMonth() + duration,
          start.getDate()
        )
      : null;

  const now = new Date();
  let monthsRemaining = 0;

  if (end) {
    monthsRemaining =
      (end.getFullYear() - now.getFullYear()) * 12 +
      (end.getMonth() - now.getMonth());
    monthsRemaining = Math.max(monthsRemaining, 0);
  }

  // Simulation si données valides
  let monthlyCalc = 0;
  let totalPayments = 0;
  let interestCost = 0;
  let totalCost = 0;

  if (amount > 0 && duration > 0) {
    if (rate > 0) {
      const monthlyRate = rate / 100 / 12;
      monthlyCalc =
        (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));
    } else {
      monthlyCalc = amount / duration;
    }

    if (insurance > 0) {
      monthlyCalc += insurance;
    }
    totalPayments = monthlyCalc * duration;
    interestCost = totalPayments - amount - insurance * duration;
    totalCost = interestCost + insurance * duration;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-left font-thin">Résumé du {credit?.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Montant emprunté
            </h3>
            <p className="text-2xl font-thin">
              {isVisible ? formatCurrency.format(amount) : "••••"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Restant à payer
            </h3>
            <p className="text-2xl font-thin">
              {isVisible ? formatCurrency.format(remaining) : "••••"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Montant payé actuellement
            </h3>
            <p className="text-2xl font-thin">
              {isVisible ? formatCurrency.format(amountPayed) : "••••"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Taux d'intérêt
            </h3>
            <p className="text-2xl font-thin">{rate}%</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Mensualité
            </h3>
            <p className="text-2xl font-thin">
              {isVisible ? formatCurrency.format(monthly + insurance) : "••••"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Date de fin
            </h3>
            <p className="text-2xl font-thin">
              {end ? end.toLocaleDateString("fr-FR") : "—"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Mois restants
            </h3>
            <p className="text-2xl font-thin">{monthsRemaining}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Assurances
            </h3>
            <p className="text-2xl font-thin">
              {isVisible ? formatCurrency.format(insurance) : "••••"} / mois
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progression du remboursement</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="mt-8 flex justify-evenly gap-6">
        {insurance > 0 && (
          <>
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Coût total des assurances
              </h3>
              <p className="text-xl font-thin mt-1">
                {isVisible
                  ? formatCurrency.format(insurance * duration)
                  : "••••"}
              </p>
            </div>
            <Separator orientation="vertical" className="bg-muted h-auto" />
          </>
        )}
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Coût total des intérêts
          </h3>
          <p className="text-xl font-thin mt-1">
            {isVisible ? formatCurrency.format(interestCost) : "••••"}
          </p>
        </div>
        <Separator orientation="vertical" className="bg-muted h-auto" />
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Coût total du crédit
          </h3>
          <p className="text-xl font-thin mt-1">
            {isVisible ? formatCurrency.format(totalCost) : "••••"}
          </p>
        </div>
      </div>
    </div>
  );
}
