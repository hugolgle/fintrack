import React from "react";
import Sidebar from "../composant/navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

function MainLayout() {
  return (
    <section className="flex h-screen w-full bg-primary-background">
      {/* Sidebar */}
      <div className="sidebar h-full w-[6%] py-4 pl-4 fixed z-10">
        <Sidebar />
      </div>

      <div className="ml-auto w-[94%] h-full p-4">
        <Outlet />
      </div>
      <Toaster />
    </section>
  );
}

export default MainLayout;
