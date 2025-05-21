import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronUp } from "lucide-react";
import { formatCurrency } from "../../utils/fonctionnel";
import { calculTotalAmount } from "../../utils/calcul";

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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const theData = data
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const sortedData = [...theData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];
    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSelectAllRow = (checked) => {
    setSelectAllRow(checked);
    const newSelectedRows = {};
    theData.forEach((transaction) => {
      newSelectedRows[transaction._id] = checked;
    });
    setSelectedRows(newSelectedRows);
  };

  const handleSelectRow = (id, checked) => {
    setSelectedRows((prevSelectedRows) => {
      const updatedRows = { ...prevSelectedRows, [id]: checked };

      const allSelected =
        theData.length > 0 &&
        theData.every((transaction) => updatedRows[transaction._id]);

      setSelectAllRow(allSelected);
      return updatedRows;
    });
  };

  const calculMontantSelect = () => {
    let total = 0;
    theData?.forEach((transaction) => {
      if (selectedRows[transaction._id]) {
        total += transaction.amount;
      }
    });
    return total;
  };

  const amountSelect = calculMontantSelect();
  const amountTotal = calculTotalAmount(data);

  return (
    <>
      {theData && theData.length > 0 ? (
        <Table className="w-full flex flex-col px-1 animate-fade relative">
          <TableHeader className="flex w-full items-center">
            <TableRow className="w-full flex h-7">
              {multiselect && (
                <TableHead>
                  <Checkbox
                    checked={selectAllRow}
                    onCheckedChange={handleSelectAllRow}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              {columns.map(({ name, key }) => (
                <TableHead
                  key={key}
                  className="flex justify-center items-start w-full px-10 text-center"
                >
                  <div className="flex items-center gap-1">
                    {name}
                    <button
                      onClick={() => handleSort(key)}
                      aria-label={`Sort by ${name}`}
                      className="transition-transform"
                    >
                      <ChevronUp
                        size={16}
                        className={`opacity-50 transition-all ${
                          sortConfig.key === key &&
                          sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="flex flex-col overflow-hidden justify-center items-center w-full">
            {sortedData.map((item) => {
              const formattedRow = formatData(item);
              return (
                <TableRow
                  key={item._id}
                  className={`group w-full flex flex-row h-12 hover:bg-muted/50 items-center text-left animate-fade ${
                    selectedRows[item._id] && "bg-muted/50"
                  }`}
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
                    <TableCell key={index} className="w-full px-10 truncate">
                      {value}
                    </TableCell>
                  ))}

                  {action && (
                    <TableCell className="absolute group-hover:opacity-100 opacity-0 transition-all right-0">
                      {action(item)}
                    </TableCell>
                  )}

                  {firstItem && (
                    <TableCell
                      className={`absolute ${multiselect ? "left-8" : "left-0"}`}
                    >
                      {firstItem(item)}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <p className="animate-fade text-sm italic text-gray-400">
          Aucune opération n'a été trouvée !
        </p>
      )}

      <div className="fixed bottom-4 ring-ring text-left text-xs right-4 animate-fade rounded-md z-50 bg-secondary p-3 transition-all">
        {Object.keys(selectedRows).some((key) => selectedRows[key]) ? (
          <>
            Total sélectionnés : <br />
            <b>{formatCurrency.format(amountSelect)}</b>
          </>
        ) : (
          <>
            Total : <b>{formatCurrency.format(amountTotal)}</b>
            <br />
            <b>{theData.length}</b> opération(s)
          </>
        )}
      </div>
    </>
  );
}
