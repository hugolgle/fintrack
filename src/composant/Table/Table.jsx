import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Checkbox } from "@/components/ui/checkbox";
import { addSpace } from "../../utils/fonctionnel";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";
import { Pencil } from "lucide-react";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteTransactions } from "../../Service/Transaction.service";
import { toast } from "sonner";
import { FormEditTransac } from "../../Pages/Transaction/FormEditTransac";
import { FormEditInvestment } from "../../Pages/Investment/FormEditInvestment";
import { deleteTransaction } from "../../Service/Investment.service";

export default function Tableau({
  columns,
  data,
  type,
  refetchTransaction,
  refetchTransacInvest,
}) {
  const mutationDeleteTransaction = useMutation({
    mutationFn: async (itemId) => {
      return await deleteTransactions(itemId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      refetchTransaction();
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const mutationDeleteInvestmentTransaction = useMutation({
    mutationFn: async (itemId) => {
      return await deleteTransaction(data[0].idInvest, itemId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      refetchTransacInvest();
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const [selectAllRow, setSelectAllRow] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});

  const handleSelectAllRow = (checked) => {
    setSelectAllRow(checked);
    const newSelectedRows = {};
    data.forEach((transaction) => {
      newSelectedRows[transaction._id] = checked;
    });
    setSelectedRows(newSelectedRows);
  };

  const handleSelectRow = (id, checked) => {
    setSelectedRows((prevSelectedRows) => {
      const updatedRows = { ...prevSelectedRows, [id]: checked };

      const allSelected =
        data.length > 0 &&
        data.every((transaction) => updatedRows[transaction._id]);

      setSelectAllRow(allSelected);
      return updatedRows;
    });
  };

  const calculMontantSelect = () => {
    let total = 0;
    data?.forEach((transaction) => {
      if (selectedRows[transaction._id]) {
        total += transaction.isSale
          ? parseFloat(transaction.amount)
          : -parseFloat(transaction.amount);
      }
    });
    return total;
  };

  const calculTotalAmount = () => {
    let total = 0;
    data?.forEach((transaction) => {
      total += transaction.isSale
        ? parseFloat(transaction.amount)
        : -parseFloat(transaction.amount);
    });
    return total;
  };

  const amountSelect = calculMontantSelect();
  const amountTotal = calculTotalAmount();

  return (
    <>
      {data && data.length > 0 ? (
        <Table className="w-full flex flex-col px-1 animate-fade relative">
          <TableHeader className="flex w-full items-center">
            <TableRow className="w-full flex h-7 italic">
              {type === "transactions" && (
                <TableHead>
                  <Checkbox
                    checked={selectAllRow}
                    onCheckedChange={handleSelectAllRow}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              {columns.map(({ name }) => (
                <TableHead key={name} className="w-full text-center">
                  {name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="flex flex-col overflow-hidden justify-center items-center w-full">
            {data.map((item) => (
              <TableRow
                key={item._id}
                className={`w-full flex flex-row h-12 hover:bg-muted items-center animate-fade ${selectedRows[item._id] ? "bg-muted dark:bg-muted" : ""}`}
              >
                {type === "transactions" && (
                  <TableCell>
                    <Checkbox
                      checked={!!selectedRows[item._id]}
                      onCheckedChange={(checked) =>
                        handleSelectRow(item._id, checked)
                      }
                      aria-label={`Select row ${item._id}`}
                    />
                  </TableCell>
                )}
                {type === "investments" &&
                  (() => {
                    const category =
                      item.type === "Crypto" ? "crypto" : "symbol";
                    return (
                      <Avatar className="w-6 h-6 absolute left-4">
                        <AvatarImage
                          src={`https://assets.parqet.com/logos/${category}/${item.symbol}`}
                        />
                        <AvatarFallback className="text-[10px] font-thin">
                          {item.name.toUpperCase().substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })()}

                {Object.keys(item)
                  .filter(
                    (key) =>
                      key !== "_id" &&
                      key !== "idInvest" &&
                      key !== "detail" &&
                      !(type === "transactions" && key === "type")
                  )
                  .map((key) => (
                    <TableCell key={key} className="w-full truncate">
                      {key === "date"
                        ? format(new Date(item[key]), "d MMMM yyyy", {
                            locale: fr,
                          })
                        : key === "amount"
                          ? `${item.isSale ? "+" : !item.isSale ? "" : ""}${parseFloat(item[key]).toFixed(2)} €`
                          : key === "isSale" && item["isSale"] === false
                            ? "Achat"
                            : key === "isSale" && item["isSale"] === true
                              ? "Vente"
                              : item[key]}
                    </TableCell>
                  ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-fit w-fit p-1 absolute right-4"
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left">
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        {type === "transactions" ? (
                          <FormEditTransac
                            transaction={item}
                            refetch={refetchTransaction}
                          />
                        ) : type === "investments" ? (
                          <FormEditInvestment
                            transaction={item}
                            refetch={refetchTransacInvest}
                          />
                        ) : null}
                      </DialogContent>
                    </Dialog>

                    <DropdownMenuItem
                      onClick={() => {
                        if (type === "transactions") {
                          mutationDeleteTransaction.mutate(item._id);
                        } else if (type === "investments") {
                          mutationDeleteInvestmentTransaction.mutate(item._id);
                        }
                      }}
                      onSelect={(e) => e.preventDefault()}
                      className="text-red-500"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Aucune opération n'a été trouvée ...</p>
      )}

      <div className="fixed bottom-4 ring-1 text-xs right-4 ring-border rounded-xl z-50 bg-white dark:bg-black p-3 transition-all">
        {Object.keys(selectedRows).some((key) => selectedRows[key]) ? (
          <>
            Total sélectionnés : <br />
            <b>{addSpace(amountSelect.toFixed(2))} €</b>
          </>
        ) : (
          <>
            Total : <b>{addSpace(amountTotal.toFixed(2))} €</b>
            <br />
            <b>{data.length}</b> opération(s)
          </>
        )}
      </div>
    </>
  );
}
