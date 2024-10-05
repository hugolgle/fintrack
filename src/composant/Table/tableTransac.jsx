import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox"; // Imported Checkbox from ShadCN UI
import { addSpace, formatDate, separateMillier } from "../../utils/fonctionnel";
import { useState, useEffect } from "react";

export default function Tableau(props) {
  const [selectAllRow, setSelectAllRow] = useState(false); // State to track "Select All" checkbox
  const [selectedRows, setSelectedRows] = useState({}); // State to track individual row selections

  // Toggle all rows with "Select All" checkbox
  const handleSelectAllRow = (checked) => {
    setSelectAllRow(checked);
    const newSelectedRows = {};
    props.transactions.forEach((transaction) => {
      newSelectedRows[transaction._id] = checked;
    });
    setSelectedRows(newSelectedRows);
  };

  // Toggle individual rows and check if "Select All" should be updated
  const handleSelectRow = (id, checked) => {
    setSelectedRows((prevSelectedRows) => {
      const updatedRows = { ...prevSelectedRows, [id]: checked };

      // If all rows are selected, set "Select All" checkbox to true
      const allSelected =
        props.transactions.length > 0 &&
        props.transactions.every((transaction) => updatedRows[transaction._id]);

      setSelectAllRow(allSelected); // Update "Select All" state based on individual row selection

      return updatedRows;
    });
  };

  // Calculate the total amount of selected transactions
  const calculMontantSelect = () => {
    let total = 0;
    props.transactions.forEach((transaction) => {
      if (selectedRows[transaction._id]) {
        total += parseFloat(transaction.montant);
      }
    });
    return total;
  };

  const montantSelect = calculMontantSelect();

  return (
    <>
      {props.transactions && props.transactions.length > 0 ? (
        <Table className="w-full flex flex-col px-1 animate-fade">
          <TableHeader className="flex w-full items-center">
            {props.selectOpe && (
              <div className="mr-5 text-xs">
                {/* ShadCN Checkbox for select all */}
                <Checkbox
                  checked={selectAllRow}
                  onCheckedChange={handleSelectAllRow}
                  aria-label="Select all rows"
                />
              </div>
            )}
            <TableRow className="w-full flex h-7 italic">
              <TableHead className="w-full text-center">ID</TableHead>
              <TableHead className="w-full text-center">Titre</TableHead>
              <TableHead className="w-full text-center">Catégorie</TableHead>
              <TableHead className="w-full text-center">Date</TableHead>
              <TableHead className="w-full text-center">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="flex flex-col justify-center items-center w-full">
            {props.transactions.map((transaction) => (
              <div className="flex w-full items-center" key={transaction._id}>
                {props.selectOpe && (
                  <div className="mr-5">
                    <Checkbox
                      checked={!!selectedRows[transaction._id]} // Cast to boolean
                      onCheckedChange={(checked) =>
                        handleSelectRow(transaction._id, checked)
                      }
                      aria-label={`Select row ${transaction._id}`}
                    />
                  </div>
                )}
                <Link to={transaction._id} className="w-full">
                  <TableRow
                    className={`rounded-[14px] flex my-1 flex-row items-center h-10 bg-colorSecondaryLight dark:bg-colorPrimaryDark cursor-pointer hover:bg-opacity-75 hover:dark:bg-opacity-75 transition-all  ${
                      props.selectOpe && selectedRows[transaction._id]
                        ? "ring-1 ring-zinc-400"
                        : ""
                    }`}
                  >
                    <TableCell className="w-full">
                      {transaction._id.substring(4, 8)}
                    </TableCell>
                    <TableCell className="w-full truncate">
                      {transaction.titre}
                    </TableCell>
                    <TableCell className="w-full">
                      {transaction.categorie}
                    </TableCell>
                    <TableCell className="w-full">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell className="w-full">
                      <b>{addSpace(transaction.montant)} €</b>
                    </TableCell>
                  </TableRow>
                </Link>
              </div>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Aucune transaction n'a été trouvée ...</p>
      )}
      {props.selectOpe ? (
        <>
          <div className="fixed w-44 bottom-10 right-0 rounded-l-xl z-50 bg-colorPrimaryLight dark:bg-colorSecondaryDark py-3 transition-all">
            Total sélectionnés : <br />
            <b>{addSpace(separateMillier(montantSelect)) + " €"}</b>
            <br />
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
