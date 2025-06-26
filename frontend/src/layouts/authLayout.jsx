import React from "react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <section className="flex h-screen w-full bg-primary-background bgImageMasterAuth">
      <Outlet />
    </section>
  );
}
