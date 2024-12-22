import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getTransactionsByYear,
  getTransactionsByMonth,
  getTransactionsByType,
  getTitleOfTransactionsByType,
  getTagsOfTransactions,
} from "../../utils/operations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { categorySort, months, nameType } from "../../utils/other";
import {
  categoryDepense,
  categoryRecette,
} from "../../../public/categories.json";
import Header from "../../composant/Header.jsx";
import Tableau from "../../composant/Table/Table";
import {
  deleteTransactions,
  fetchTransactions,
} from "../../Service/Transaction.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../composant/Loader/Loader";
import { HttpStatusCode } from "axios";
import { MoreHorizontal } from "lucide-react";
import { Pencil } from "lucide-react";
import { FormEditTransac } from "./FormEditTransac.jsx";
import { Trash } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { FormAddRefund } from "./FormAddRefund.jsx";
import { TicketSlash } from "lucide-react";
import { Plus } from "lucide-react";
import ModalTable from "../Epargn/Modal/ModalTable.jsx";
import { toast } from "sonner";

export default function PageTransactions(props) {
  const { date } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({});
  const queryClient = useQueryClient();

  const {
    isLoading,
    data: dataTransactions,
    isFetching,
    refetch: refectTransac,
  } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const mutationDeleteTransaction = useMutation({
    mutationFn: async (itemId) => {
      return await deleteTransactions(itemId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["fetchTransactions"]);
      refectTransac();
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    performSearch(event.target.value);
  };

  const typeProps =
    props.type === "Expense"
      ? "expense"
      : props.type === "Revenue"
        ? "revenue"
        : undefined;

  const categories =
    props.type === "Expense"
      ? categorySort(categoryDepense)
      : props.type === "Revenue"
        ? categorySort(categoryRecette)
        : "";

  const [selectedCategorys, setSelectedCategorys] = useState(
    searchParams.getAll("categories")
  );
  const [selectedTags, setSelectedTags] = useState(searchParams.getAll("tags"));
  const [selectedTitles, setSelectedTitles] = useState(
    searchParams.getAll("titles")
  );

  const titles = getTitleOfTransactionsByType(dataTransactions, props.type);

  const handleCheckboxChange = (event, type) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    let updatedArray;
    if (type === "category") {
      updatedArray = isChecked
        ? [...selectedCategorys, value]
        : selectedCategorys.filter((cat) => cat !== value);
      setSelectedCategorys(updatedArray);
    } else if (type === "title") {
      updatedArray = isChecked
        ? [...selectedTitles, value]
        : selectedTitles.filter((title) => title !== value);
      setSelectedTitles(updatedArray);
    } else if (type === "tag") {
      updatedArray = isChecked
        ? [...selectedTags, value]
        : selectedTags.filter((tag) => tag !== value);
      setSelectedTags(updatedArray);
    }

    setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);

      if (updatedArray.length === 0 && type === "category") {
        updatedParams.delete("categories");
      } else if (updatedArray.length > 0 && type === "category") {
        updatedParams.set("categories", updatedArray.join(","));
      }

      if (updatedArray.length === 0 && type === "title") {
        updatedParams.delete("titles");
      } else if (updatedArray.length > 0 && type === "title") {
        updatedParams.set("titles", updatedArray.join(","));
      }

      if (updatedArray.length === 0 && type === "tag") {
        updatedParams.delete("tags");
      } else if (updatedArray.length > 0 && type === "tag") {
        updatedParams.set("tags", updatedArray.join(","));
      }

      return updatedParams;
    });
  };

  const check =
    selectedCategorys.length + selectedTitles.length + selectedTags.length;

  const transactions =
    date === "all"
      ? getTransactionsByType(
          dataTransactions,
          props.type,
          selectedCategorys,
          selectedTitles,
          selectedTags
        )
      : date?.length === 4
        ? getTransactionsByYear(
            dataTransactions,
            date,
            props.type,
            selectedCategorys,
            selectedTitles,
            selectedTags
          )
        : getTransactionsByMonth(
            dataTransactions,
            date,
            props.type,
            selectedCategorys,
            selectedTitles,
            selectedTags
          );

  const theData = transactions.map(
    ({
      _id,
      type,
      title,
      category,
      detail,
      amount,
      initialAmount,
      refunds,
      tag,
      date,
      createdAt,
    }) => {
      return {
        _id,
        type,
        title,
        category,
        date,
        detail,
        refunds,
        tag,
        amount,
        initialAmount,
        createdAt,
      };
    }
  );

  const tags = getTagsOfTransactions(dataTransactions);

  const performSearch = (term) => {
    const filteredData = theData.filter((item) => {
      const titleMatches = item.title
        .toLowerCase()
        .includes(term.toLowerCase());

      const typeMatches = item.type.toLowerCase().includes(term.toLowerCase());

      const amountMatches = item.amount
        .toString()
        .toLowerCase()
        .includes(term.toLowerCase());
      const tagsMatches =
        item.tag && Array.isArray(item.tag) && item.tag.length > 0
          ? item.tag.some((tag) =>
              tag.toLowerCase().includes(term.toLowerCase())
            )
          : false;

      const dateMatches = item.date?.toString().includes(term.toLowerCase());

      return (
        titleMatches ||
        typeMatches ||
        amountMatches ||
        dateMatches ||
        tagsMatches
      );
    });

    setSearchResults(filteredData);
  };

  const clearFilters = () => {
    setSelectedCategorys([]);
    setSelectedTitles([]);
    setSelectedTags([]);
    setSearchParams({});
  };

  const clickLastMonth = () => {
    if (date) {
      let yearNum = parseInt(date.slice(0, 4), 10);
      if (date.length === 4) {
        yearNum -= 1;
      }

      let monthNum = parseInt(date.slice(4), 10);
      monthNum -= 1;
      if (monthNum === 0) {
        monthNum = 12;
        yearNum -= 1;
      }
      const newMonth = monthNum.toString().padStart(2, "0");
      const newDate = `${yearNum}${newMonth}`;
      if (date.length === 4) {
        navigate(`/${typeProps}/${yearNum}`);
      } else if (date.length === 6) {
        navigate(`/${typeProps}/${newDate}`);
      } else {
        return "";
      }
    }
  };

  const clickNextMonth = () => {
    if (date) {
      let yearNum = parseInt(date.slice(0, 4), 10);
      if (date.length === 4) {
        yearNum += 1;
      }
      let monthNum = parseInt(date.slice(4), 10);
      monthNum += 1;
      if (monthNum === 13) {
        monthNum = 1;
        yearNum += 1;
      }
      const newMonth = monthNum.toString().padStart(2, "0");
      const newDate = `${yearNum}${newMonth}`;
      if (date.length === 4) {
        navigate(`/${typeProps}/${yearNum}`);
      } else if (date.length === 6) {
        navigate(`/${typeProps}/${newDate}`);
      } else {
        return "";
      }
    }
  };

  const columns = [
    {
      id: 1,
      name: "Titre",
      key: "title",
    },
    {
      id: 2,
      name: "Catégorie",
      key: "category",
    },
    {
      id: 3,
      name: "Date",
      key: "date",
    },
    {
      id: 4,
      name: "Montant",
      key: "amount",
    },
  ];

  const convertDate = (date) => {
    const annee = Math.floor(date / 100);
    const mois = date % 100;
    return `${months[mois - 1]} ${annee}`;
  };

  const formatData = (row) => {
    return [
      row.title,
      row.category,
      format(row.date, "PP", { locale: fr }),
      row.refunds.length > 0
        ? `${formatCurrency.format(row.amount)} *`
        : formatCurrency.format(row.amount),
    ];
  };

  const action = (item) => {
    const columns = [
      { id: 1, name: "Titre", key: "title" },
      { id: 2, name: "Date", key: "date" },
      { id: 3, name: "Montant", key: "amount" },
    ];
    const formatData = (row) => {
      return [
        row.title,
        format(row.date, "PP", { locale: fr }),
        formatCurrency.format(row.amount),
      ];
    };
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontal className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          {item.type === "Expense" && (
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un remb.
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <FormAddRefund transaction={item} refetch={refectTransac} />
              </DialogContent>
            </Dialog>
          )}

          {item?.refunds && item?.refunds?.length > 0 && (
            <ModalTable
              initialAmount={item.initialAmount}
              btnOpen={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <TicketSlash className="mr-2 h-4 w-4" />
                  Remboursement(s)
                </DropdownMenuItem>
              }
              data={item?.refunds}
              formatData={formatData}
              columns={columns}
              title="Remboursements"
              description="Liste des remboursements."
            />
          )}

          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <FormEditTransac transaction={item} refetch={refectTransac} />
            </DialogContent>
          </Dialog>

          <DropdownMenuItem
            onClick={() => {
              mutationDeleteTransaction.mutate(item._id);
            }}
            onSelect={(e) => e.preventDefault()}
            className="text-red-500"
          >
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isLoading) return <Loader />;
  return (
    <>
      <section className="w-full">
        <Header
          title={`${
            date === "all"
              ? `Toutes les ${nameType(props.type).toLowerCase()}s`
              : date?.length === 4
                ? `${nameType(props.type)}s de ${date}`
                : `${nameType(props.type)}s de ${convertDate(date)}`
          }`}
          typeProps={props.type}
          categories={categories}
          tags={tags}
          check={check}
          clickLastMonth={clickLastMonth}
          clickNextMonth={clickNextMonth}
          date={date}
          searchTerm={searchTerm}
          titles={titles}
          clearFilters={clearFilters}
          handleCheckboxChange={handleCheckboxChange}
          selectedTitles={selectedTitles}
          selectedCategorys={selectedCategorys}
          selectedTags={selectedTags}
          btnSearch
          isFetching={isFetching}
          handleSearchChange={handleSearchChange}
          btnAdd={`/${props.type.toLowerCase()}/add`}
          btnReturn
          btnFilter
        />

        <Tableau
          data={searchTerm ? searchResults : theData}
          columns={columns}
          action={action}
          type="transactions"
          formatData={formatData}
          multiselect
        />
      </section>
    </>
  );
}
