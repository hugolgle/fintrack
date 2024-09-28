import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../@/components/ui/table";
import { addSpace, formatDate, separateMillier } from "../../utils/fonctionnel";
import { Circle, CircleCheck } from "lucide-react";
import { useState } from "react";

export default function Tableau(props: any) {
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {},
  );

  const handleSelectAllRow = () => {
    const newSelectAll = !selectAllRow;
    setSelectAllRow(newSelectAll);
    const newSelectedRows: { [key: string]: boolean } = {};
    props.transactions.forEach((transaction: any) => {
      newSelectedRows[transaction._id] = newSelectAll;
    });
    setSelectedRows(newSelectedRows);
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [id]: !prevSelectedRows[id],
    }));
  };

  const calculMontantSelect = () => {
    let total = 0;
    props.transactions.forEach((transaction: any) => {
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
        <Table className="w-full flex flex-col px-1 ">
          <TableHeader className="flex w-full items-center">
            {props.selectOpe && (
              <div className="mr-5 text-xs">
                {selectAllRow ? (
                  <CircleCheck
                    className="cursor-pointer hover:scale-110 transition-all"
                    onClick={handleSelectAllRow}
                  />
                ) : (
                  <Circle
                    className="cursor-pointer hover:scale-110 transition-all"
                    onClick={handleSelectAllRow}
                  />
                )}
              </div>
            )}
            <TableRow className="w-full flex flex-row h-7 italic">
              <TableHead className="w-full">ID</TableHead>
              <TableHead className="w-full">Titre</TableHead>
              <TableHead className="w-full">Catégorie</TableHead>
              <TableHead className="w-full">Date</TableHead>
              <TableHead className="w-full">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="flex flex-col justify-center items-center w-full">
            {props.transactions.map((transaction: any) => (
              <div className="flex w-full items-center" key={transaction._id}>
                {props.selectOpe && (
                  <div className="mr-5">
                    {selectedRows[transaction._id] ? (
                      <CircleCheck
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => handleSelectRow(transaction._id)}
                      />
                    ) : (
                      <Circle
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => handleSelectRow(transaction._id)}
                      />
                    )}
                  </div>
                )}
                <Link to={transaction._id} className="w-full">
                  <TableRow
                    className={`rounded flex my-1 flex-row items-center bg-zinc-100 dark:bg-zinc-900 cursor-pointer hover:bg-opacity-75 hover:dark:bg-opacity-75 transition-all animate-fade-up ${
                      selectedRows[transaction._id]
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
          <div className="fixed w-44 bottom-10 right-0 rounded-l-xl z-50 bg-zinc-200 dark:bg-zinc-800 py-3 transition-all">
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
