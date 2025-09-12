import React from "react";

function Container({ children, custom, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-full relative h-auto flex flex-col shadow-lg justify-between bg-secondary/40 ring-1 ring-border transition-all rounded-md p-4 ${custom}`}
    >
      {children}
    </div>
  );
}

export default Container;
