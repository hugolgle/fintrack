import React, { useState } from "react";
import { Eye, EyeClosed, Menu } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import Sidebar from "./sidebars.jsx";
import { Button } from "@/components/ui/button";
import { useAmountVisibility } from "../context/AmountVisibilityContext.jsx";

function Header({ title, subtitle = "ㅤ", isFetching, navigation }) {
  const [showResponsiveMenu, setShowResponsiveMenu] = useState(false);

  const { isVisible, toggleVisibility } = useAmountVisibility();

  const toggleMenu = () => {
    setShowResponsiveMenu(!showResponsiveMenu);
  };

  return (
    <div className="w-full justify-between flex animate-fade relative pb-8">
      {isFetching && (
        <LoaderCircle className="absolute p-1 mb-1 bottom-0 left-0 animate-spin" />
      )}
      <div className="flex flex-col items-start">
        <Menu
          size={20}
          className="cursor-pointer hover:scale-110 transition-all lg:hidden mb-2"
          onClick={toggleMenu}
        />
        {showResponsiveMenu && (
          <>
            <Sidebar responsive setShowResponsiveMenu={setShowResponsiveMenu} />
          </>
        )}
        <h1 className="relative text-md sm:text-xl md:text-2xl font-bold animate-fade text-primary text-left">
          {title}{" "}
        </h1>
        <p className="text-muted-foreground text-sm text-left">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-2 items-end justify-center w-auto">
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            className="aspect-square w-fit"
            onClick={() => toggleVisibility()}
          >
            {isVisible ? <Eye /> : <EyeClosed />}
          </Button>
          {navigation}
        </div>
      </div>
    </div>
  );
}

export default Header;
