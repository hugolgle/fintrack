import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getTransactionsByType,
  getTitleOfTransactionsByType,
  getTagsOfTransactions,
} from "../../utils/operations.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { alphaSort, months, nameType } from "../../utils/other.js";
import { categoryDepense } from "../../../public/categories.json";
import Header from "../../components/headers.jsx";
import Tableau from "../../components/tables/table.jsx";
import {
  deleteTransactions,
  fetchTransactions,
} from "../../services/transaction.service.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/loaders/loader.jsx";
import { HttpStatusCode } from "axios";
import { Dot, EllipsisVertical, MoreHorizontal } from "lucide-react";
import { Pencil } from "lucide-react";
import { FormTransac } from "./formFinance.jsx";
import { Trash } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { FormAddRefund } from "./formAddRefund.jsx";
import { TicketSlash } from "lucide-react";
import { Plus } from "lucide-react";
import ModalTable from "../epargns/modal/modalTable.jsx";
import { toast } from "sonner";
import { TYPES } from "../../staticDatas/staticData.js";

export default function PageTransaction({ type }) {
  const { year, month } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({});
  const queryClient = useQueryClient();
  const dateSelected = year ? (month ? `${year}${month}` : year) : "all";

  const {
    isLoading,
    data: dataTransactions,
    isFetching,
    refetch,
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
      refetch();
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    performSearch(event.target.value);
  };

  const categories = alphaSort(categoryDepense);

  const [selectedCategorys, setSelectedCategorys] = useState(
    searchParams.getAll("categories")
  );
  const [selectedTags, setSelectedTags] = useState(searchParams.getAll("tags"));
  const [selectedTitles, setSelectedTitles] = useState(
    searchParams.getAll("titles")
  );

  const titles = getTitleOfTransactionsByType(dataTransactions, type);

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

  const dataTransacs = getTransactionsByType(
    dataTransactions,
    type,
    selectedCategorys,
    selectedTitles,
    selectedTags
  );

  const dataTransacsByYear = dataTransacs?.filter((transaction) => {
    const transactionYear = transaction.date.slice(0, 4);
    return transactionYear === year;
  });

  const dataTransacsByMonth = dataTransacs?.filter((transaction) => {
    const transactionDate = transaction.date.split("T")[0];
    const transactionMonth = transactionDate.slice(0, 7);

    return transactionMonth === `${year}-${month}`;
  });

  const transactions = !year
    ? dataTransacs
    : year && !month
      ? dataTransacsByYear
      : month && dataTransacsByMonth;

  const displayData = transactions.map(
    ({
      _id,
      type,
      title,
      category,
      detail,
      amount,
      group,
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
        group,
        initialAmount,
        createdAt,
      };
    }
  );

  const tags = getTagsOfTransactions(dataTransactions);

  const performSearch = (term) => {
    const filteredData = displayData.filter((item) => {
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
    if (year) {
      let yearNum = parseInt(year);
      if (!month) {
        navigate(`/finance/transactions/${type.toLowerCase()}/${yearNum - 1}`);
      } else {
        let monthNum = parseInt(month) - 1;
        if (monthNum === 0) {
          monthNum = 12;
          yearNum -= 1;
        }
        const newMonth = monthNum.toString().padStart(2, "0");
        const newDate = `${yearNum}/${newMonth}`;
        navigate(`/finance/transactions/${type.toLowerCase()}/${newDate}`);
      }
    }
  };

  const clickNextMonth = () => {
    if (year) {
      let yearNum = parseInt(year);
      if (!month) {
        navigate(`/finance/transactions/${type.toLowerCase()}/${yearNum + 1}`);
      } else {
        let monthNum = parseInt(month) + 1;
        if (monthNum > 12) {
          monthNum = 1;
          yearNum += 1;
        }
        const newMonth = monthNum.toString().padStart(2, "0");
        const newDate = `${yearNum}/${newMonth}`;
        navigate(`/finance/transactions/${type.toLowerCase()}/${newDate}`);
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

  const pastilleType = (item) => {
    return item.type === "Expense" ? (
      <Dot color="red" />
    ) : item.type === "Revenue" ? (
      <Dot color="green" />
    ) : null;
  };

  const formatData = (row) => {
    return [
      <div className="flex flex-col lg:flex-row gap-2 items-center">
        {row.title}
        {row.tag.map((t, index) => (
          <Badge
            key={index}
            className="group relative flex items-center animate-pop-up gap-2"
            variant="secondary"
          >
            {t}
          </Badge>
        ))}
      </div>,
      <Badge
        className="group w-fit relative flex items-center animate-pop-up gap-2"
        variant="outline"
      >
        {row.category}
      </Badge>,
      format(row.date, "PP", { locale: fr }),
      row.refunds.length > 0 ? (
        <div className="flex gap-2 items-center">
          {formatCurrency.format(row.amount)}
          <TicketSlash strokeWidth={1} color="grey" />
        </div>
      ) : row.type === TYPES.INCOME ? (
        <p className="text-green-500">+{formatCurrency.format(row.amount)}</p>
      ) : (
        <p className="text-red-500">{formatCurrency.format(row.amount)}</p>
      ),
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
        <DropdownMenuTrigger>
          <EllipsisVertical className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          {item.type === TYPES.EXPENSE && (
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un remb.
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <FormAddRefund transaction={item} refetch={refetch} />
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
              <FormTransac
                key={item}
                editMode
                transaction={item}
                refetch={refetch}
                type={type}
              />
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

  const data = searchTerm ? searchResults : displayData;

  if (isLoading) return <Loader />;

  return (
    <>
      <section className="w-full">
        <Header
          title={
            !type
              ? "Toutes les transactions"
              : !year
                ? `Toutes les ${nameType(type).toLowerCase()}s`
                : year && !month
                  ? `${nameType(type)}s de ${dateSelected}`
                  : `${nameType(type)}s de ${convertDate(dateSelected)}`
          }
          clickLastMonth={clickLastMonth}
          clickNextMonth={clickNextMonth}
          isFetching={isFetching}
          btnSearch={{ handleSearchChange, searchTerm }}
          modalAdd={<FormTransac refetch={refetch} type={type} />}
          btnReturn
          btnFilter={{
            selectedTags,
            selectedCategorys,
            selectedTitles,
            clearFilters,
            handleCheckboxChange,
            check,
            tags,
            categories,
            titles,
          }}
          navigateDate={year}
        />

        <Tableau
          data={data}
          columns={columns}
          action={action}
          type="transactions"
          formatData={formatData}
          firstItem={pastilleType}
          multiselect
        />
      </section>
    </>
  );
}
