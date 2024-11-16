import React from "react";
import BtnReturn from "./Button/ButtonReturn.jsx";
import BtnAdd from "./Button/ButtonAdd.jsx";
import BtnFilter from "./Button/ButtonFilter.jsx";
import BtnSearch from "./Button/ButtonResearch.jsx";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PopoverFilter from "./PopoverFilter.jsx";
import { BreadcrumbDemo } from "./BreadCrumb.jsx";
import { useLocation } from "react-router";
import { ChevronLeft, ListCollapse, ChevronRight } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { DialogDelete } from "./DialogDelete.jsx";

function Header({
  title,
  typeProps,
  check,
  clickLastMonth,
  clickNextMonth,
  date,
  handleSearchChange,
  searchTerm,
  categories,
  titles,
  clearFilters,
  handleCheckboxChange,
  selectedTitles,
  selectedCategorys,
  btnReturn,
  btnAdd,
  btnAddTo,
  btnFilter,
  btnSearch,
  btnTrash,
  isFetching,
}) {
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const canReturn = pathSegments.length >= 2;

  return (
    <div className="w-full justify-between flex animate-fade relative">
      <div className="flex flex-col gap-2 items-start w-1/4 justify-start">
        <BreadcrumbDemo />
        <div className="flex gap-2">
          {btnReturn && canReturn && <BtnReturn />}
          {btnAdd && <BtnAdd to={btnAddTo} />}
          {btnTrash && (
            <>
              <DialogDelete />
            </>
          )}

          {btnFilter && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="none" className="p-0 h-fit">
                    <BtnFilter check={check} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="select-none w-80 max-h-80 overflow-auto">
                  <PopoverFilter
                    categories={categories}
                    titles={titles}
                    clearFilters={clearFilters}
                    handleCheckboxChange={handleCheckboxChange}
                    selectedTitles={selectedTitles}
                    selectedCategorys={selectedCategorys}
                  />
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      </div>
      <h1 className="text-4xl font-thin mb-5 italic animate-fade w-2/4 truncate">
        {title}
      </h1>
      <div className="w-1/4 flex justify-end">
        {btnSearch && (
          <>
            <div className="flex gap-8">
              <BtnSearch
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
              />
              {typeProps === "investment" ||
                (date !== "all" && (
                  <div className="flex gap-4 top-0 right-0">
                    <ChevronLeft
                      className="rounded-full p-1 cursor-pointer transition-all"
                      onClick={clickLastMonth}
                    />
                    <ChevronRight
                      className="rounded-full p-1 cursor-pointer transition-all"
                      onClick={clickNextMonth}
                    />
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
      {isFetching && (
        <LoaderCircle className="absolute top-0 right-0 animate-spin" />
      )}
    </div>
  );
}

export default Header;
