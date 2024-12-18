import React from "react";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PopoverFilter from "./PopoverFilter.jsx";
import { useLocation } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import { ArrowLeftRight } from "lucide-react";
import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

function Header({
  title,
  typeProps,
  check,
  clickLastMonth,
  switchComponent,
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
  selectedTags,
  btnReturn,
  btnAdd,
  tags,
  btnFilter,
  btnSearch,
  isFetching,
  btnAction,
}) {
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const canReturn = pathSegments.length >= 2;

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full justify-between flex animate-fade relative">
      <div className="flex flex-col gap-2 items-start w-1/4 justify-start">
        {/* <BreadcrumbDemo /> */}
        <div className="flex gap-2">
          {btnReturn && canReturn && (
            <CircleArrowLeft
              size={20}
              className="cursor-pointer hover:scale-110 transition-all"
              onClick={handleGoBack}
            />
          )}
          {btnAdd && (
            <Link
              className="cursor-pointer hover:scale-110 transition-all"
              to={btnAdd}
            >
              <CirclePlus size={20} />
            </Link>
          )}
          {btnAction && (
            <Link
              className="cursor-pointer hover:scale-110 transition-all"
              to="/epargn/action"
            >
              <ArrowLeftRight size={20} />
            </Link>
          )}
          {switchComponent && switchComponent}
          {btnFilter && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="none" className="p-0 h-fit">
                    <div className="relative hover:scale-110 transition-all">
                      <Filter size={20} className="cursor-pointer" />
                      {check > 0 ? (
                        <>
                          <span className="absolute text-xs -top-2 bg-primary rounded-full px-1 animate-pop-up">
                            {check}
                          </span>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="select-none w-80 max-h-80 overflow-auto">
                  <PopoverFilter
                    tags={tags}
                    categories={categories}
                    titles={titles}
                    clearFilters={clearFilters}
                    handleCheckboxChange={handleCheckboxChange}
                    selectedTitles={selectedTitles}
                    selectedCategorys={selectedCategorys}
                    selectedTags={selectedTags}
                  />
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      </div>
      <h1 className="text-4xl font-thin mb-5 font-logo animate-fade w-2/4 truncate">
        {title}
      </h1>
      <div className="w-1/4 flex justify-end">
        {btnSearch && (
          <>
            <div className="flex gap-8">
              <div className="relative">
                <Input
                  className="pl-8"
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Rechercher"
                />
                <Search className="absolute left-2 top-[19px] transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
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
