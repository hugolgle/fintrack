import React from "react";
import Sidebar from "../composant/sidebar";
import { Outlet } from "react-router-dom";

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
    </section>
  );
}

export default MainLayout;
