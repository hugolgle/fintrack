import React from "react";

function Container({ children, custom }) {
  return (
    <div
      className={`w-full relative h-auto flex flex-col justify-between bg-secondary/40 ring-1 ring-border transition-all rounded-md p-4 ${custom}`}
    >
      {children}
    </div>
  );
}

export default Container;
