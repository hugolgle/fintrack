import { useEffect, useState } from "react";
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
import TableauTransac from "../../../components/Table/tableTransac";
import BtnReturn from "../../../components/Button/btnReturn";
import BtnAdd from "../../../components/Button/btnAdd";
import { ChevronLeft, ChevronRight, ListCollapse } from "lucide-react";
import BtnFilter from "../../../components/Button/btnFilter";
import { categorieSort } from "../../../utils/other";
import { categorieDepense } from "../../../../public/categories.json";
import { categorieRecette } from "../../../../public/categories.json";
import Title from "../../../components/Text/title";
import CardMessage from "../../../components/cardMessage";

export default function PageTransactions(props: any) {
  const [transactionDeleted, setTransactionDeleted] = useState(false);
  const { date } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const typeProps =
    props.type === "Dépense"
      ? "depense"
      : props.type === "Recette"
        ? "recette"
        : undefined;
  const [selectOpe, setSelectOpe] = useState(false);

  const handleSelectOpe = () => {
    setSelectOpe(!selectOpe);
  };

  const categories =
    props.type === "Dépense"
      ? categorieSort(categorieDepense)
      : props.type === "Recette"
        ? categorieSort(categorieRecette)
        : "";

  const [showModal, setShowModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("categories")
  );
  const [selectedTitles, setSelectedTitles] = useState<string[]>(
    searchParams.getAll("titles")
  );

  const titles = getTitleOfTransactionsByType(props.type);

  useEffect(() => {
    const isTransactionDeleted =
      localStorage.getItem("transactionDeleted") === "true";
    if (isTransactionDeleted) {
      setTransactionDeleted(true);
      localStorage.removeItem("transactionDeleted");
      const timeout = setTimeout(() => {
        setTransactionDeleted(false);
      }, 7000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCheckboxChange = (event: any, type: string) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    const updatedArray = isChecked
      ? type === "categorie"
        ? [...selectedCategories, value]
        : [...selectedTitles, value]
      : type === "categorie"
        ? selectedCategories.filter((cat) => cat !== value)
        : selectedTitles.filter((title) => title !== value);

    if (type === "categorie") {
      setSelectedCategories(updatedArray);
      setSearchParams({ categories: updatedArray, titles: selectedTitles });
    } else {
      setSelectedTitles(updatedArray);
      setSearchParams({ categories: selectedCategories, titles: updatedArray });
    }
  };

  const check = selectedCategories.length + selectedTitles.length;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const performSearch = (term: string) => {
    const filteredTransactions = transactions.filter((transaction: any) => {
      const titleMatches = transaction.titre
        .toLowerCase()
        .includes(term.toLowerCase());
      const categoryMatches = transaction.categorie
        .toLowerCase()
        .includes(term.toLowerCase());
      return titleMatches || categoryMatches;
    });
    setSearchResults(filteredTransactions);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    performSearch(event.target.value);
  };

  const transactions =
    date === "all"
      ? getTransactionsByType(props.type, selectedCategories, selectedTitles)
      : date?.length === 4
        ? getTransactionsByYear(
            date,
            props.type,
            selectedCategories,
            selectedTitles
          )
        : getTransactionsByMonth(
            date,
            props.type,
            selectedCategories,
            selectedTitles
          );

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(transactions);
    }
  }, [searchTerm, transactions]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTitles([]);
    setSearchParams({});
    setShowModal(false);
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

  return (
    <>
      <section className="w-full relative">
        <Title
          title={`${
            date === "all"
              ? `Toutes les ${props.type.toLowerCase()}s`
              : date?.length === 4
                ? `${props.type}s de ${date}`
                : `${props.type}s de ${convertDate(date)}`
          }`}
        />
        <div className="absolute top-0 flex flex-row w-full gap-2">
          <BtnReturn />
          <BtnAdd to={`/${typeProps}`} />
          <ListCollapse
            className={`cursor-pointer hover:scale-110 transition-all ${selectOpe ? "text-zinc-500" : ""}`}
            onClick={handleSelectOpe}
          />
          <BtnFilter categories={categories} action={toggleModal} check={check}>
            {showModal && (
              <div className="flex flex-col bg-zinc-200 dark:bg-zinc-800 rounded z-50 text-left p-2 mt-8 absolute max-h-60 overflow-scroll">
                <p className="text-center font-semibold">
                  Filtrer par catégorie :
                </p>
                <div className="grid grid-cols-3 gap-x-2 mt-3">
                  {Array.isArray(categories) &&
                    categories.map(({ name }: { name: string }) => (
                      <div key={name}>
                        <input
                          type="checkbox"
                          id={name}
                          name="categorie"
                          value={name}
                          checked={selectedCategories.includes(name)}
                          onChange={(e) => handleCheckboxChange(e, "categorie")}
                          className="cursor-pointer opacity-50"
                        />
                        <label htmlFor={name} className="cursor-pointer">
                          {" "}
                          {name}
                        </label>
                      </div>
                    ))}
                </div>
                <p className="text-center font-semibold">Filtrer par titre :</p>
                <div className="grid grid-cols-3 gap-x-2 mt-3">
                  {Array.isArray(titles) &&
                    titles.map((title: any, index) => (
                      <div key={index}>
                        <input
                          type="checkbox"
                          id={title}
                          name="title"
                          value={title}
                          checked={selectedTitles.includes(title)}
                          onChange={(e) => handleCheckboxChange(e, "title")}
                          className="cursor-pointer opacity-50"
                        />
                        <label htmlFor={title} className="cursor-pointer">
                          {" "}
                          {title}
                        </label>
                      </div>
                    ))}
                </div>

                <button
                  className="text-xs hover:bg-red-500 transition-all fixed"
                  onClick={clearFilters}
                >
                  Annuler
                </button>
              </div>
            )}
          </BtnFilter>
          <input
            className="rounded-xl px-2 w-32 bg-zinc-100 dark:bg-zinc-900 placeholder:text-sm"
            type="search"
            placeholder="Rechercher"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div
          className={`flex flex-row gap-4 absolute top-0 right-0 ${date === "all" ? "invisible" : ""}`}
        >
          <ChevronLeft
            className="hover:bg-zinc-200 hover:dark:bg-zinc-800 rounded-full p-2 cursor-pointer duration-300 transition-all"
            size={37.5}
            onClick={clickLastMonth}
          />
          <ChevronRight
            className="hover:bg-zinc-200 hover:dark:bg-zinc-800 rounded-full p-2 cursor-pointer duration-300 transition-all"
            size={37.5}
            onClick={clickNextMonth}
          />
        </div>

        <TableauTransac
          transactions={searchTerm ? searchResults : transactions}
          selectOpe={selectOpe}
        />

        <div className="fixed w-44 bottom-10 right-0 rounded-l-xl shadow-2xl shadow-black bg-zinc-200 hover:opacity-0 dark:bg-zinc-800 py-3 transition-all">
          Total :{" "}
          <b>
            {date === "all"
              ? calculTotal(props.type, selectedCategories, selectedTitles)
              : date && date.length === 4
                ? calculTotalByYear(
                    props.type,
                    date,
                    selectedCategories,
                    selectedTitles
                  )
                : date
                  ? calculTotalByMonth(
                      props.type,
                      date,
                      selectedCategories,
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
                  selectedCategories,
                  selectedTitles
                ).length
              : date?.length === 4
                ? getTransactionsByYear(
                    date,
                    props.type,
                    selectedCategories,
                    selectedTitles
                  ).length
                : getTransactionsByMonth(
                    date,
                    props.type,
                    selectedCategories,
                    selectedTitles
                  ).length}
          </b>
        </div>
        {transactionDeleted ? (
          <CardMessage
            message="Votre transaction a été supprimée avec succès"
            color="bg-red-500"
          />
        ) : null}
      </section>
    </>
  );
}
