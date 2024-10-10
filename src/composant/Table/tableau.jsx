import { Link, useParams } from "react-router-dom";
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
import { useState } from "react";

export default function Tableau({ type, columns, data, selectOpe }) {
  const { status } = useParams();

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
    data.forEach((transaction) => {
      if (selectedRows[transaction._id]) {
        total += parseFloat(transaction.amount);
      }
    });
    return total;
  };

  const montantSelect = calculMontantSelect();

  return (
    <>
      {data && data.length > 0 ? (
        <Table className="w-full flex flex-col px-1 animate-fade">
          <TableHeader className="flex w-full items-center">
            {selectOpe && (
              <div className="mr-5 text-xs">
                <Checkbox
                  checked={selectAllRow}
                  onCheckedChange={handleSelectAllRow}
                  aria-label="Select all rows"
                />
              </div>
            )}
            <TableRow className="w-full flex h-7 italic">
              {columns.map(({ name }) => (
                <TableHead key={name} className="w-full text-center">
                  {name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="flex flex-col justify-center items-center w-full">
            {data.map((item) => (
              <div className="flex w-full items-center" key={item._id}>
                {selectOpe && (
                  <div className="mr-5">
                    <Checkbox
                      checked={!!selectedRows[item._id]}
                      onCheckedChange={(checked) =>
                        handleSelectRow(item._id, checked)
                      }
                      aria-label={`Select row ${item._id}`}
                    />
                  </div>
                )}
                <Link to={item._id} className="w-full">
                  <TableRow
                    className={`rounded-[14px] flex my-1 flex-row items-center h-10 bg-colorSecondaryLight dark:bg-colorPrimaryDark animate-fade cursor-pointer hover:bg-opacity-75 hover:dark:bg-opacity-75 transition-all ${
                      selectOpe && selectedRows[item._id]
                        ? "ring-1 ring-zinc-400"
                        : ""
                    }`}
                  >
                    <TableCell className="w-full">
                      {item._id.substring(4, 8)}
                    </TableCell>

                    {type === "investments" && (
                      <>
                        <TableCell className="w-full">{item.type}</TableCell>
                        <TableCell className="w-full truncate">
                          {item.title}
                        </TableCell>
                        <TableCell className="w-full">
                          {formatDate(item.date)}
                        </TableCell>
                        {status === "all" && (
                          <TableCell className="w-full">
                            <p>{item.isSold ? "Vendu" : "En cours"}</p>
                          </TableCell>
                        )}
                        <TableCell className="w-full">
                          <b>{addSpace(item.amount)} €</b>
                        </TableCell>
                        {status === "sold" && (
                          <>
                            <TableCell className="w-full">
                              <b>{separateMillier(item.montantVendu)} €</b>
                            </TableCell>
                            <TableCell className="w-full">
                              <b>
                                {item.benefice > 0
                                  ? `+${separateMillier(item.benefice)} €`
                                  : `-${separateMillier(item.benefice)} €`}
                              </b>
                            </TableCell>
                          </>
                        )}
                      </>
                    )}
                    {type === "transactions" && (
                      <>
                        <TableCell className="w-full truncate">
                          {item.title}
                        </TableCell>
                        <TableCell className="w-full">
                          {item.category}
                        </TableCell>
                        <TableCell className="w-full">
                          {formatDate(item.date)}
                        </TableCell>
                        <TableCell className="w-full">
                          <b>{addSpace(item.amount)} €</b>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                </Link>
              </div>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Aucune transaction n'a été trouvée ...</p>
      )}
      {selectOpe && (
        <div className="fixed w-44 bottom-10 right-0 rounded-l-xl z-50 bg-colorPrimaryLight dark:bg-colorSecondaryDark py-3 transition-all">
          Total sélectionnés : <br />
          <b>{addSpace(separateMillier(montantSelect))} €</b>
          <br />
        </div>
      )}
    </>
  );
}
