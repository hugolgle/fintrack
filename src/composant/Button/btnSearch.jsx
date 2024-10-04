import { Search } from "lucide-react";

function BtnSearch({ searchTerm, handleSearchChange }) {
  return (
    <div className="relative">
      <input
        className="rounded-[10px] px-8 h-full w-auto bg-colorSecondaryLight dark:bg-colorPrimaryDark focus:outline-none"
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <Search className="absolute left-2 top-[19px] transform -translate-y-1/2 h-4 w-4 text-gray-500" />
    </div>
  );
}

export default BtnSearch;
