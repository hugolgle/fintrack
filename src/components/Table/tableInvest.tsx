import { Link, useParams } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../@/components/ui/table";
import { addSpace, formatDate, separateMillier } from "../../utils/fonctionnel";

export default function TableauInvest(props: any) {
  const { urlInvest } = useParams<{ urlInvest: string }>();
  return (
    <>
      {props.investments && props.investments.length > 0 ? (
        <Table className="w-full flex flex-col px-1 ">
          <TableHeader>
            <TableRow className="w-full flex flex-row h-7">
              <TableHead className="w-full">ID</TableHead>
              <TableHead className="w-full">Type</TableHead>
              <TableHead className="w-full">Titre</TableHead>
              <TableHead className="w-full">Date</TableHead>
              {urlInvest === "all" && (
                <TableHead className="w-full">État</TableHead>
              )}
              <TableHead className="w-full">
                Montant {urlInvest === "sold" && "acheté"}
              </TableHead>
              {urlInvest === "sold" && (
                <TableHead className="w-full">Montant vendu</TableHead>
              )}
              {urlInvest === "sold" && (
                <TableHead className="w-full">Bénéfice/Déficit</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="flex flex-col justify-center items-center w-full">
            {props.investments.map((investment: any) => (
              <Link
                to={investment._id}
                className="w-full animate-fade-up"
                key={investment._id}
              >
                <TableRow className="rounded flex my-1 flex-row items-center bg-zinc-100 dark:bg-zinc-900 cursor-pointer hover:bg-opacity-75 hover:dark:bg-opacity-75 transition-all">
                  <TableCell className="w-full">
                    {investment._id.substring(4, 8)}
                  </TableCell>
                  <TableCell className="w-full">{investment.type}</TableCell>
                  <TableCell className="w-full truncate">
                    {investment.titre}
                  </TableCell>
                  <TableCell className="w-full">
                    {formatDate(investment.date)}
                  </TableCell>
                  {urlInvest === "all" && (
                    <TableCell className="w-full">
                      <p>{investment.isSold === true ? "Vendu" : "En cours"}</p>
                    </TableCell>
                  )}
                  <TableCell className="w-full">
                    <b>- {addSpace(investment.montant)} €</b>
                  </TableCell>
                  {urlInvest === "sold" && (
                    <TableCell className="w-full">
                      <p>{separateMillier(investment.montantVendu)} €</p>
                    </TableCell>
                  )}
                  {urlInvest === "sold" && (
                    <TableCell className="w-full">
                      <p>{separateMillier(investment.benefice)} €</p>
                    </TableCell>
                  )}
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Aucun investissements n'a été trouvée ...</p>
      )}
    </>
  );
}
