import React from "react";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PopoverFilter from "./PopoverFilter.jsx";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { ROUTES } from "./Routes.jsx";

function Header({
  title,
  clickLastMonth,
  switchComponent,
  clickNextMonth,
  btnSearch,
  btnReturn,
  btnAdd,
  btnFilter,
  isFetching,
  btnAction,
  navigateDate,
  actionEdit,
  modalAdd,
}) {
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const canReturn = pathSegments.length >= 2;

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full justify-between flex animate-fade relative mb-8">
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
          {modalAdd && (
            <Dialog modal>
              <DialogTrigger>
                <CirclePlus
                  size={20}
                  className="cursor-pointer hover:scale-110 transition-all"
                />
              </DialogTrigger>
              <DialogContent>{modalAdd}</DialogContent>
            </Dialog>
          )}
          {btnAction && (
            <Link
              className="cursor-pointer hover:scale-110 transition-all"
              to={ROUTES.ACTION_EPARGN}
            >
              <ArrowLeftRight size={20} />
            </Link>
          )}
          {switchComponent && switchComponent}
          {btnFilter && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="none" className="p-0 h-fit">
                  <div className="relative hover:scale-110 transition-all">
                    <Filter size={20} className="cursor-pointer" />
                    {btnFilter.check > 0 ? (
                      <div className="absolute -top-2 -right-1 bg-primary rounded-full size-[14px] animate-pop-up flex items-center justify-center">
                        <p className="text-[10px] text-secondary">
                          {btnFilter.check}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="select-none w-80 max-h-80 overflow-auto">
                <PopoverFilter
                  tags={btnFilter.tags}
                  categories={btnFilter.categories}
                  titles={btnFilter.titles}
                  clearFilters={btnFilter.clearFilters}
                  handleCheckboxChange={btnFilter.handleCheckboxChange}
                  selectedTitles={btnFilter.selectedTitles}
                  selectedCategorys={btnFilter.selectedCategorys}
                  selectedTags={btnFilter.selectedTags}
                />
              </PopoverContent>
            </Popover>
          )}
          {actionEdit}
        </div>
      </div>
      <h1 className="text-4xl font-thin font-logo animate-fade w-2/4 truncate">
        {title}
      </h1>
      <div className="w-1/4 flex justify-end">
        <div className="flex gap-8">
          {btnSearch && (
            <div className="relative">
              <Input
                className="pl-8"
                type="search"
                value={btnSearch.searchTerm}
                onChange={btnSearch.handleSearchChange}
                placeholder="Rechercher"
              />
              <Search className="absolute left-2 top-[19px] transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {clickLastMonth && clickNextMonth && navigateDate && (
            <div className="flex gap-4 top-0 right-0">
              <ChevronLeft
                className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                onClick={clickLastMonth}
              />
              <ChevronRight
                className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                onClick={clickNextMonth}
              />
            </div>
          )}
        </div>
      </div>
      {isFetching && (
        <LoaderCircle className="absolute p-1 mb-1 bottom-0 right-0 animate-spin" />
      )}
    </div>
  );
}

export default Header;
