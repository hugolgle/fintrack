import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "../../context/ThemeContext";

function BtnSearch({ searchTerm, handleSearchChange }) {
  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";
  return (
    <div className="relative">
      <Input
        className={`rounded-[10px] ${bgColor} pl-8`}
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <Search className="absolute left-2 top-[19px] transform -translate-y-1/2 h-4 w-4 text-gray-500" />
    </div>
  );
}

export default BtnSearch;
