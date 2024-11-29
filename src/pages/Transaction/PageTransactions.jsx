import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getTransactionsByYear,
  getTransactionsByMonth,
  getTransactionsByType,
  getTitleOfTransactionsByType,
} from "../../utils/operations";
import {
  categorySort,
  months,
  nameType,
  normalizeText,
} from "../../utils/other";
import {
  categoryDepense,
  categoryRecette,
} from "../../../public/categories.json";
import Header from "../../composant/Header.jsx";
import Tableau from "../../composant/Table/Table";
import { fetchTransactions } from "../../Service/Transaction.service";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../composant/Loader/Loader";
import { HttpStatusCode } from "axios";

export default function PageTransactions(props) {
  const { isLoading, data, isFetching, refetch } = useQuery({
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

  const { date } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
  const [selectedTitles, setSelectedTitles] = useState(
    searchParams.getAll("titles")
  );

  const titles = getTitleOfTransactionsByType(data, props.type);

  const handleCheckboxChange = (event, type) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    const updatedArray = isChecked
      ? type === "category"
        ? [...selectedCategorys, value]
        : [...selectedTitles, value]
      : type === "category"
        ? selectedCategorys.filter((cat) => cat !== value)
        : selectedTitles.filter((title) => title !== value);

    if (type === "category") {
      setSelectedCategorys(updatedArray);
      setSearchParams({ categories: updatedArray, titles: selectedTitles });
    } else {
      setSelectedTitles(updatedArray);
      setSearchParams({ categories: selectedCategorys, titles: updatedArray });
    }
  };

  const check = selectedCategorys.length + selectedTitles.length;
  const [searchTerm, setSearchTerm] = useState("");

  const transactions =
    date === "all"
      ? getTransactionsByType(
          data,
          props.type,
          selectedCategorys,
          selectedTitles
        )
      : date?.length === 4
        ? getTransactionsByYear(
            data,
            date,
            props.type,
            selectedCategorys,
            selectedTitles
          )
        : getTransactionsByMonth(
            data,
            date,
            props.type,
            selectedCategorys,
            selectedTitles
          );

  const formatData = transactions.map(
    ({ _id, type, title, category, detail, amount, date }) => {
      return {
        _id,
        type,
        title,
        category,
        date,
        detail,
        amount,
      };
    }
  );

  const clearFilters = () => {
    setSelectedCategorys([]);
    setSelectedTitles([]);
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
    },
    {
      id: 2,
      name: "Catégorie",
    },
    {
      id: 3,
      name: "Date",
    },
    {
      id: 4,
      name: "Montant",
    },
  ];

  const convertDate = (date) => {
    const annee = Math.floor(date / 100);
    const mois = date % 100;
    return `${months[mois - 1]} ${annee}`;
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
          typeProps={normalizeText(props.type)}
          categories={categories}
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
          btnSearch
          btnAdd
          btnAddTo={`/${props.type.toLowerCase()}`}
          btnReturn
          btnFilter
          btnSelect
        />

        <Tableau
          data={formatData}
          columns={columns}
          type="transactions"
          isFetching={isFetching}
          refetchTransaction={refetch}
        />
      </section>
    </>
  );
}
