import React from "react";
import { Outlet } from "react-router-dom";
import { versionApp } from "../utils/other";
import Sidebar from "../components/Sidebar";

export function MainLayout() {
  return (
    <section className="flex h-screen w-full bg-primary-background">
      <div className="sidebar animate__animated animate__fadeInLeft h-full w-[6%] py-4 pl-4 fixed z-10">
        <Sidebar />
      </div>

      <div className="ml-auto w-[94%] h-full p-4">
        <Outlet />
        <p className="fixed top-0 right-0 mr-1 text-[10px] text-muted-foreground italic">
          {versionApp}
        </p>
      </div>
    </section>
  );
}
