import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/fonctionnel";
import { useAmountVisibility } from "../../context/AmountVisibilityContext";

export function PaymentHistory({ credit, mutationDelete }) {
  const payments = credit?.transactions;
  const { isVisible } = useAmountVisibility();

  return (
    <>
      <h2 className="text-left font-thin">Historique des Paiements</h2>
      <div className="mt-4">
        <Table className="w-full flex flex-col px-1 relative">
          <TableHeader className="flex w-full items-center">
            <TableRow className="w-full flex h-7 italic">
              <TableHead className="w-full px-10 text-center">Date</TableHead>
              <TableHead className="w-full px-10 text-center">
                Montant
              </TableHead>
              <TableHead className="w-full px-10 text-center">
                Amortissement
              </TableHead>
              <TableHead className="w-full px-10 text-center">
                Restant dû
              </TableHead>
              <TableHead className="w-full px-10 text-center">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="flex flex-col overflow-hidden justify-center items-center w-full">
            {payments
              ?.sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((payment, index) => (
                <TableRow
                  key={index}
                  className="group relative w-full flex flex-row h-12 items-center text-left"
                >
                  <TableCell className="w-full px-10 truncate">
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="w-full px-10 truncate">
                    {isVisible ? formatCurrency.format(payment.amount) : "••••"}
                  </TableCell>
                  <TableCell className="w-full px-10 truncate">
                    {isVisible
                      ? formatCurrency.format(payment.depreciation)
                      : "••••"}
                  </TableCell>
                  <TableCell className="w-full px-10 truncate">
                    {isVisible
                      ? formatCurrency.format(payment.remainingAmount)
                      : "••••"}
                  </TableCell>
                  <TableCell className="w-full px-10 truncate">
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm">Payé</span>
                    </div>
                  </TableCell>
                  <div className="group-hover:opacity-100 opacity-0 transition-all asolute right-4 my-auto flex items-center justify-center">
                    <Trash2
                      className="h-4 w-4 text-red-500 mr-1 cursor-pointer hover:scale-105 transition-all"
                      onClick={() => {
                        mutationDelete({
                          creditId: credit._id,
                          paymentId: payment._id,
                        });
                      }}
                    />
                  </div>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
