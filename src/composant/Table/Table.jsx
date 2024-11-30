import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { formatEuro } from "../../utils/fonctionnel";

export default function Tableau({
  columns,
  data,
  formatData,
  action,
  firstItem,
  multiselect,
}) {
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
              {multiselect && (
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
            {data
              .sort((a, b) => {
                const dateSort =
                  new Date(b.date).getTime() - new Date(a.date).getTime();
                if (dateSort !== 0) return dateSort;

                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              })
              .map((item) => {
                const formattedRow = formatData(item);
                return (
                  <TableRow
                    key={item._id}
                    className={`w-full flex flex-row h-12 hover:bg-muted items-center animate-fade ${selectedRows[item._id] && "bg-muted"}`}
                  >
                    {multiselect && (
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

                    {formattedRow.map((value, index) => (
                      <TableCell
                        key={index}
                        className="w-full text-center truncate"
                      >
                        {value}
                      </TableCell>
                    ))}

                    {action && (
                      <TableCell className="absolute right-0">
                        {action(item)}
                      </TableCell>
                    )}

                    {firstItem && (
                      <TableCell className="absolute left-0">
                        {firstItem(item)}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      ) : (
        <p className="animate-fade italic text-gray-400">
          Aucune opération n'a été trouvée !
        </p>
      )}

      <div className="fixed bottom-4 ring-1 text-xs right-4 ring-border animate-fade rounded-xl z-50 bg-primary-foreground p-3 transition-all">
        {Object.keys(selectedRows).some((key) => selectedRows[key]) ? (
          <>
            Total sélectionnés : <br />
            <b>{formatEuro.format(amountSelect)}</b>
          </>
        ) : (
          <>
            Total : <b>{formatEuro.format(amountTotal)}</b>
            <br />
            <b>{data.length}</b> opération(s)
          </>
        )}
      </div>
    </>
  );
}
