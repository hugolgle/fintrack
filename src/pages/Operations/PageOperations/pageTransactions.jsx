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
import TableauTransac from "../../../composant/Table/tableTransac";
import { CircleX } from "lucide-react";
import { categorieSort, normalizeText } from "../../../utils/other";
import {
  categorieDepense,
  categorieRecette,
} from "../../../../public/categories.json";
import { ModalContext } from "../../../context/ModalContext"; // Assurez-vous que le chemin est correct
import Modal from "../../../composant/modal"; // Assurez-vous que le chemin est correct
import LayoutOperation from "../../../layout/layoutOperation";

export default function PageTransactions(props) {
  const { date } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openModal, closeModal } = useContext(ModalContext);

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

  const [selectedCategories, setSelectedCategories] = useState(
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
  const [searchResults, setSearchResults] = useState([]);
  const [clickResearch, setClickResearch] = useState(false);

  const performSearch = (term) => {
    const filteredTransactions = transactions.filter((transaction) => {
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

  const handleSearchChange = (event) => {
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
      <section className="w-full">
        <LayoutOperation
          title={`${
            date === "all"
              ? `Toutes les ${props.type.toLowerCase()}s`
              : date?.length === 4
                ? `${props.type}s de ${date}`
                : `${props.type}s de ${convertDate(date)}`
          }`}
          typeProps={normalizeText(props.type)}
          categories={categories}
          openModal={openModal}
          check={check}
          selectOpe={selectOpe}
          setClickResearch={setClickResearch}
          clickResearch={clickResearch}
          handleSelectOpe={handleSelectOpe}
          clickLastMonth={clickLastMonth}
          clickNextMonth={clickNextMonth}
          date={date}
          pageTable
        />
        <Modal>
          <CircleX
            onClick={closeModal}
            className="self-end cursor-pointer hover:scale-95 transition-all"
          />
          <div className="flex flex-col gap-2">
            <p className="text-center font-thin italic">
              Filtrer par catégorie :
            </p>
            <div className="grid grid-cols-3 gap-x-2 mt-1">
              {Array.isArray(categories) &&
                categories.map(({ index, name }) => (
                  <div key={index} className="flex gap-2">
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
                      {name}
                    </label>
                  </div>
                ))}
            </div>
            <p className="text-center font-thin italic">Filtrer par titre :</p>
            <div className="grid grid-cols-3 gap-x-2 mt-1">
              {Array.isArray(titles) &&
                titles.map((title, index) => (
                  <div key={index} className="flex gap-2">
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
                      {title}
                    </label>
                  </div>
                ))}
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-2 mt-4 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-950 transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </Modal>

        {clickResearch && (
          <input
            className="rounded-[10px] mb-2 px-2 h-8 w-52 bg-colorSecondaryLight animate-fade dark:bg-colorPrimaryDark placeholder:text-sm focus:outline-none"
            type="search"
            placeholder="Rechercher"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        )}

        <TableauTransac
          transactions={searchTerm ? searchResults : transactions}
          selectOpe={selectOpe}
        />

        <div className="fixed w-44 bottom-10 right-0 rounded-l-xl shadow-2xl shadow-black bg-colorPrimaryLight hover:opacity-0 dark:bg-zinc-900 py-3 transition-all">
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
      </section>

      {/* Modal pour le filtre */}
    </>
  );
}
