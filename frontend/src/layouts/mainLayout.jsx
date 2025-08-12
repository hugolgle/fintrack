import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { versionApp } from "../utils/other";
import Sidebar from "../components/sidebars";
import { ChevronLeft } from "lucide-react";

export function MainLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const widthScreen = window.screen.width;
  return (
    <section className="flex h-screen w-full bg-primary-background">
      <div
        className={`sidebar hidden animate__animated animate__fadeInLeft h-full transition-all duration-300 ease-in-out ${isOpen ? "w-[14%]" : " w-[6%]"} py-4 pl-4 lg:block lg:fixed z-10`}
      >
        <Sidebar
          btnOpen={
            widthScreen > 1900 && (
              <div
                className="absolute animate__animated animate__zoomIn animate__delay-1s top-36 right-0 translate-x-1/2 bg-muted rounded-full p-1 flex justify-center items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <ChevronLeft
                  className={`transition-all duration-300 size-3 ease-in-out ${!isOpen ? "rotate-180" : ""}`}
                />
              </div>
            )
          }
          isOpen={isOpen}
        />
      </div>

      <div
        className={`ml-auto transition-all duration-300 ease-in-out ${isOpen ? "w-[86%]" : "w-screen lg:w-[94%]"} h-full p-4`}
      >
        <Outlet />
        <p className="fixed top-0 right-0 mr-1 text-[10px] text-muted-foreground italic">
          {versionApp}
        </p>
      </div>
    </section>
  );
}
