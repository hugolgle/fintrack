import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronUp } from "lucide-react";
import { formatCurrency } from "../../utils/fonctionnel";
import { calculTotalAmount } from "../../utils/calcul";
import { Search, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAmountVisibility } from "../../context/AmountVisibilityContext";

export default function Tableau({
  columns,
  data,
  formatData,
  action,
  firstItem,
  multiselect,
  fieldsFilter,
  dateFilter,
}) {
  const { isVisible } = useAmountVisibility();
  const [selectAllRow, setSelectAllRow] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedFilters, setSelectedFilters] = useState({});
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const getUniqueValues = (field) => {
    const values = data.map((item) => item[field]);
    return [...new Set(values.flat())].filter(Boolean);
  };

  const handleCheckboxChange = (field, value, checked) => {
    const updated = { ...selectedFilters };
    if (!updated[field]) updated[field] = [];

    updated[field] = checked
      ? [...updated[field], value]
      : updated[field].filter((v) => v !== value);

    setSelectedFilters(updated);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const performSearch = (term) => {
    const lowerTerm = term.toLowerCase();
    const filtered = data.filter((item) =>
      Object.values(item).some((val) => {
        if (Array.isArray(val)) {
          return val.some((v) =>
            v.toString().toLowerCase().includes(lowerTerm)
          );
        }
        return val && val.toString().toLowerCase().includes(lowerTerm);
      })
    );
    setSearchResults(filtered);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    performSearch(val);
  };

  const applyFilters = (dataToFilter) => {
    return dataToFilter.filter((item) => {
      const passesFilters = Object.entries(selectedFilters).every(
        ([field, values]) => {
          if (values.length === 0) return true;
          const itemValue = item[field];
          if (Array.isArray(itemValue)) {
            return itemValue.some((val) => values.includes(val));
          }
          return values.includes(itemValue);
        }
      );

      if (!passesFilters) return false;

      if (dateRange?.from || dateRange?.to) {
        const itemDate = new Date(item.date || item.createdAt);
        if (dateRange.from && dateRange.to) {
          return itemDate >= dateRange.from && itemDate <= dateRange.to;
        } else if (dateRange.from) {
          return itemDate.toDateString() === dateRange.from.toDateString();
        } else if (dateRange.to) {
          return itemDate.toDateString() === dateRange.to.toDateString();
        }
      }

      return true;
    });
  };

  const sortedData = [...data]
    ?.sort(
      (a, b) =>
        new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const displayData = applyFilters(searchTerm ? searchResults : sortedData);

  const handleSelectAllRow = (checked) => {
    setSelectAllRow(checked);
    const updated = {};
    displayData.forEach((item) => {
      updated[item._id] = checked;
    });
    setSelectedRows(updated);
  };

  const handleSelectRow = (id, checked) => {
    const updated = { ...selectedRows, [id]: checked };
    setSelectedRows(updated);

    const allSelected = displayData.every((item) => updated[item._id]);
    setSelectAllRow(allSelected);
  };

  const amountSelect = displayData.reduce(
    (acc, item) => (selectedRows[item._id] ? acc + item.amount : acc),
    0
  );
  const amountTotal = calculTotalAmount(displayData);

  return (
    <>
      <div className="flex gap-4 items-center mb-4 animate-fade">
        <div className="relative w-52">
          <Input
            className="pl-8"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Rechercher"
          />
          <Search className="absolute left-2 top-[19px] transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {dateFilter && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon size={16} />
                {dateRange?.from && dateRange?.to
                  ? `${format(dateRange?.from, "dd MMM yyyy", { locale: fr })} - ${format(
                      dateRange?.to,
                      "dd MMM yyyy",
                      { locale: fr }
                    )}`
                  : "Choisir une période"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" className="flex items-center gap-2">
              <Filter size={20} className="cursor-pointer" />
              Filtrer
            </Button>
          </PopoverTrigger>
          <PopoverContent className="select-none w-80 max-h-80 overflow-auto">
            <Accordion type="multiple" className="w-full">
              {fieldsFilter?.map((field) => (
                <AccordionItem value={field.key} key={field.key}>
                  <AccordionTrigger className="capitalize text-sm">
                    <p>
                      Par <span className="lowercase">{field.fieldName}</span>
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 text-xs gap-y-[2px] px-1">
                      {getUniqueValues(field.key).map((value, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Checkbox
                            id={`${field.key}-${value}`}
                            checked={
                              selectedFilters[field.key]?.includes(value) ||
                              false
                            }
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(field.key, value, checked)
                            }
                          />
                          <label
                            htmlFor={`${field.key}-${value}`}
                            className="cursor-pointer"
                          >
                            {value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </PopoverContent>
        </Popover>
        <div className="flex flex-wrap gap-2">
          {Object.entries(selectedFilters).map(([field, values]) =>
            values.map((value) => (
              <span
                key={`${field}-${value}`}
                className="bg-secondary text-sm px-2 py-1 rounded-md flex items-center gap-1"
              >
                {value}
                <button
                  onClick={() => handleCheckboxChange(field, value, false)}
                  className="ml-1 text-muted-foreground hover:text-destructive"
                >
                  &times;
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {displayData && displayData.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[600px] flex flex-col px-1 animate-fade relative">
            <TableHeader className="flex w-full items-center">
              <TableRow className="w-full flex min-w-[600px] h-7">
                {multiselect && (
                  <TableHead>
                    <Checkbox
                      checked={selectAllRow}
                      onCheckedChange={handleSelectAllRow}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                )}
                {columns.map(({ name, key }) => (
                  <TableHead
                    key={key}
                    className="flex justify-center items-start w-full px-2 sm:px-4 md:px-10 text-center text-[10px] sm:text-xs"
                  >
                    <div className="flex items-center gap-1">
                      {name}
                      <button
                        onClick={() => handleSort(key)}
                        aria-label={`Sort by ${name}`}
                        className="transition-transform"
                      >
                        <ChevronUp
                          size={16}
                          className={`opacity-50 transition-all ${
                            sortConfig.key === key &&
                            sortConfig.direction === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="flex flex-col md:overflow-hidden justify-center items-center w-full">
              {displayData.map((item) => {
                const formattedRow = formatData(item);
                return (
                  <TableRow
                    key={item._id}
                    className={`group w-full flex flex-row h-12 hover:bg-muted/50 items-center text-left animate-fade ${
                      selectedRows[item._id] && "bg-muted/50"
                    }`}
                  >
                    {multiselect && (
                      <TableCell>
                        <Checkbox
                          checked={!!selectedRows[item._id]}
                          onCheckedChange={(checked) =>
                            handleSelectRow(item._id, checked)
                          }
                          aria-label={`Select row ${item._id}`}
                        />
                      </TableCell>
                    )}

                    {formattedRow.map((value, index) => (
                      <TableCell
                        key={index}
                        className="w-full px-2 sm:px-4 md:px-10 truncate text-[11px] sm:text-sm"
                      >
                        {value}
                      </TableCell>
                    ))}

                    {action && (
                      <TableCell className="absolute group-hover:opacity-100 opacity-0 transition-all right-0">
                        {action(item)}
                      </TableCell>
                    )}

                    {firstItem && (
                      <TableCell
                        className={`absolute ${multiselect ? "left-8" : "left-0"}`}
                      >
                        {firstItem(item)}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="animate-fade text-sm italic text-gray-400">
          Aucune opération n'a été trouvée !
        </p>
      )}

      <div className="fixed bottom-4 ring-ring text-left text-xs right-4 max-w-[90%] animate-fade rounded-md z-50 bg-secondary p-3 transition-all">
        {Object.keys(selectedRows).some((key) => selectedRows[key]) ? (
          <>
            Total sélectionnés : <br />
            <b>{isVisible ? formatCurrency.format(amountSelect) : "••••"}</b>
          </>
        ) : (
          <>
            Total :{" "}
            <b>{isVisible ? formatCurrency.format(amountTotal) : "••••"}</b>
            <br />
            <b>{displayData.length}</b> opération(s)
          </>
        )}
      </div>
    </>
  );
}
