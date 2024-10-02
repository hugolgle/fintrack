import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { addSpace, formatDate, separateMillier } from "../../utils/fonctionnel";
import { Circle, CircleCheck } from "lucide-react";
import { useState } from "react";

export default function Tableau(props) {
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});

  const handleSelectAllRow = () => {
    const newSelectAll = !selectAllRow;
    setSelectAllRow(newSelectAll);
    const newSelectedRows = {};
    props.transactions.forEach((transaction) => {
      newSelectedRows[transaction._id] = newSelectAll;
    });
    setSelectedRows(newSelectedRows);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [id]: !prevSelectedRows[id],
    }));
  };

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
                    className={`rounded-[14px] flex my-1 flex-row items-center h-10 bg-zinc-100 dark:bg-zinc-900 cursor-pointer hover:bg-opacity-75 hover:dark:bg-opacity-75 transition-all  ${
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
