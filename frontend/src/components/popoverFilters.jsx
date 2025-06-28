import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

function PopoverFilter({ data = [], fields = [] }) {
  const [selectedFilters, setSelectedFilters] = useState({});

  // Extraire les valeurs uniques pour chaque champ à filtrer
  const getUniqueValues = (field) => {
    const values = data.map((item) => item[field]);
    return [...new Set(values.flat())].filter(Boolean);
  };

  const handleCheckboxChange = (field, value, checked) => {
    const updated = { ...selectedFilters };
    if (!updated[field]) updated[field] = [];

    if (checked) {
      updated[field].push(value);
    } else {
      updated[field] = updated[field].filter((v) => v !== value);
    }

    setSelectedFilters(updated);
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field) => (
        <div key={field}>
          <p className="text-center font-thin italic text-sm capitalize">
            Filtrer par {field} :
          </p>
          <div className="grid grid-cols-2 text-xs gap-y-[2px]">
            {getUniqueValues(field).map((value, index) => (
              <div key={index} className="flex gap-2">
                <Checkbox
                  id={`${field}-${value}`}
                  checked={selectedFilters[field]?.includes(value) || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(field, value, checked)
                  }
                  className="cursor-pointer"
                />
                <label htmlFor={`${field}-${value}`} className="cursor-pointer">
                  {value}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={clearFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  );
}

export default PopoverFilter;
