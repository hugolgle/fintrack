import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { convertDate } from "../../../utils/fonctionnel";
import {
  calculTotalByMonth,
  calculTotal,
  calculTotalByYear,
} from "../../../utils/calcul";
import {
  getTransactionsByYear,
  getTransactionsByMonth,
  getTransactionsByType,
  getTitleOfTransactionsByType,
} from "../../../utils/operations";
import { categorySort, nameType, normalizeText } from "../../../utils/other";
import {
  categoryDepense,
  categoryRecette,
} from "../../../../public/categories.json";
import Header from "../../../composant/header";
import Tableau from "../../../composant/Table/tableau";

export default function PageTransactions(props) {
  const { date } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const typeProps =
    props.type === "Expense"
      ? "expense"
      : props.type === "Revenue"
        ? "revenue"
        : undefined;

  const [selectOpe, setSelectOpe] = useState(false);
  const handleSelectOpe = () => {
    setSelectOpe(!selectOpe);
  };

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

  const titles = getTitleOfTransactionsByType(props.type);

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
  const [searchResults, setSearchResults] = useState([]);
  const [clickResearch, setClickResearch] = useState(false);

  const performSearch = (term) => {
    const filteredTransactions = transactions.filter((transaction) => {
      const idMatches = transaction._id
        .toLowerCase()
        .includes(term.toLowerCase());
      const titleMatches = transaction.title
        .toLowerCase()
        .includes(term.toLowerCase());
      const categoryMatches = transaction.category
        .toLowerCase()
        .includes(term.toLowerCase());
      const montantMatches = transaction.amount
        .toLowerCase()
        .includes(term.toLowerCase());
      const dateMatches = transaction.date
        .toLowerCase()
        .includes(term.toLowerCase());
      return (
        idMatches ||
        titleMatches ||
        categoryMatches ||
        montantMatches ||
        dateMatches
      );
    });
    setSearchResults(filteredTransactions);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    performSearch(event.target.value);
  };

  const transactions =
    date === "all"
      ? getTransactionsByType(props.type, selectedCategorys, selectedTitles)
      : date?.length === 4
        ? getTransactionsByYear(
            date,
            props.type,
            selectedCategorys,
            selectedTitles
          )
        : getTransactionsByMonth(
            date,
            props.type,
            selectedCategorys,
            selectedTitles
          );

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(transactions);
    }
  }, [searchTerm, transactions]);

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
      name: "ID",
    },
    {
      id: 2,
      name: "Titre",
    },
    {
      id: 3,
      name: "Catégorie",
    },
    {
      id: 4,
      name: "Date",
    },
    {
      id: 5,
      name: "Montant",
    },
  ];

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
          selectOpe={selectOpe}
          setClickResearch={setClickResearch}
          clickResearch={clickResearch}
          handleSelectOpe={handleSelectOpe}
          clickLastMonth={clickLastMonth}
          clickNextMonth={clickNextMonth}
          date={date}
          handleSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          titles={titles}
          clearFilters={clearFilters}
          handleCheckboxChange={handleCheckboxChange}
          selectedTitles={selectedTitles}
          selectedCategorys={selectedCategorys}
          btnSearch
          btnAdd
          btnReturn
          btnFilter
          btnSelect
        />

        <Tableau
          data={searchTerm ? searchResults : transactions}
          selectOpe={selectOpe}
          columns={columns}
          type="transactions"
        />

        <div className="fixed w-44 bottom-10 right-0 rounded-l-xl shadow-2xl shadow-black bg-colorPrimaryLight hover:opacity-0 dark:bg-zinc-900 py-3 transition-all">
          Total :{" "}
          <b>
            {date === "all"
              ? calculTotal(props.type, selectedCategorys, selectedTitles)
              : date && date.length === 4
                ? calculTotalByYear(
                    props.type,
                    date,
                    selectedCategorys,
                    selectedTitles
                  )
                : date
                  ? calculTotalByMonth(
                      props.type,
                      date,
                      selectedCategorys,
                      selectedTitles
                    )
                  : "Date non définie"}
          </b>
          <br />
          Transaction(s) :{" "}
          <b>
            {date === "all"
              ? getTransactionsByType(
                  props.type,
                  selectedCategorys,
                  selectedTitles
                ).length
              : date?.length === 4
                ? getTransactionsByYear(
                    date,
                    props.type,
                    selectedCategorys,
                    selectedTitles
                  ).length
                : getTransactionsByMonth(
                    date,
                    props.type,
                    selectedCategorys,
                    selectedTitles
                  ).length}
          </b>
        </div>
      </section>
    </>
  );
}
