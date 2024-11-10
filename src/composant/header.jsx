import React from "react";
import BtnReturn from "./Button/btnReturn";
import BtnAdd from "./Button/btnAdd";
import BtnFilter from "./Button/btnFilter";
import Title from "./Text/title";
import BtnSearch from "./Button/btnSearch";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PopoverFilter from "./popoverFilter";
import { BreadcrumbDemo } from "./breadCrumb";
import { useLocation } from "react-router";
import { ChevronLeft, ListCollapse, ChevronRight } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { Pencil } from "lucide-react";
import { DialogEditInvest } from "./dialogEditInvest";

function Header({
  title,
  typeProps,
  check,
  selectOpe,
  handleSelectOpe,
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
  btnFilter,
  btnSearch,
  btnSelect,
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
          {btnAdd && <BtnAdd to={``} />}
          {btnSelect && (
            <ListCollapse
              className={`cursor-pointer hover:scale-110 transition-all ${selectOpe ? "text-zinc-500" : ""}`}
              onClick={handleSelectOpe}
              size={20}
            />
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
      <Title title={title} className="w-2/4 truncate" />
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
                      className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full p-1 cursor-pointer transition-all"
                      onClick={clickLastMonth}
                    />
                    <ChevronRight
                      className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full p-1 cursor-pointer transition-all"
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
