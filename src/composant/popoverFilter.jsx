import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

function PopoverFilter({
  categories,
  titles,
  clearFilters,
  handleCheckboxChange,
  selectedTitles,
  selectedCategorys,
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-center font-thin italic text-sm">
          Filtrer par catégorie :
        </p>
        <div className="grid grid-cols-2 text-xs gap-y-[2px]">
          {Array.isArray(categories) &&
            categories.map(({ index, name }) => (
              <div key={index} className="flex gap-2">
                <Checkbox
                  id={name}
                  name="category"
                  value={name}
                  checked={selectedCategorys.includes(name)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      { target: { value: name, checked } },
                      "category"
                    )
                  }
                  className="cursor-pointer"
                />
                <label htmlFor={name} className="cursor-pointer">
                  {name}
                </label>
              </div>
            ))}
        </div>
        <p className="text-center font-thin italic text-sm">
          Filtrer par titre :
        </p>
        <div className="grid grid-cols-2 text-xs gap-y-[2px]">
          {Array.isArray(titles) &&
            titles.map((title, index) => (
              <div key={index} className="flex gap-2">
                <Checkbox
                  id={title}
                  name="title"
                  value={title}
                  checked={selectedTitles.includes(title)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      { target: { value: title, checked } },
                      "titles"
                    )
                  }
                  className="cursor-pointer"
                />
                <label htmlFor={title} className="cursor-pointer">
                  {title}
                </label>
              </div>
            ))}
        </div>

        <Button variant="outline" onClick={clearFilters} className="mt-2">
          Réinitialiser les filtres
        </Button>
      </div>
    </>
  );
}

export default PopoverFilter;
