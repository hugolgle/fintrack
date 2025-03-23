import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";
import Container from "../Container/Container";
import { formatCurrency } from "../../utils/fonctionnel";

export function PaymentHistory({ credit }) {
  const payments = credit?.transactions;

  return (
    <>
      <h2 className="text-left">Historique des Paiements</h2>
      <div className="mt-4">
        <Table className="w-full flex flex-col px-1 relative">
          <TableHeader className="flex w-full items-center">
            <TableRow className="w-full flex h-7 italic">
              <TableHead className="w-full px-10 text-center">Date</TableHead>
              <TableHead className="w-full px-10 text-center">
                Montant
              </TableHead>
              <TableHead className="w-full px-10 text-center">
                Restant dû
              </TableHead>
              <TableHead className="w-full px-10 text-center">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="flex flex-col overflow-hidden justify-center items-center w-full">
            {payments
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((payment, index) => (
                <TableRow
                  key={index}
                  className="w-full flex flex-row h-12 items-center text-left"
                >
                  <TableCell className="w-full px-10 truncate text-center">
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="w-full px-10 truncate text-center">
                    {formatCurrency.format(payment.amount)}
                  </TableCell>
                  <TableCell className="w-full px-10 truncate text-center">
                    {formatCurrency.format(payment.remainingAmount)}
                  </TableCell>
                  <TableCell className="w-full px-10 truncate text-center">
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm">Payé</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
