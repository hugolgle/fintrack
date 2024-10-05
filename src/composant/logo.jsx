import React from "react";

function Logo({ navbar }) {
  return navbar ? (
    <div className="flex justify-center font-logo items-center tracking-tight">
      <p className="p-2 bg-transparent dark:bg-white cursor-pointer text-zinc-900 dark:text-zinc-900 group-hover:bg-colorPrimaryDark text-nowrap group-hover:dark:bg-transparent group-hover:text-white group-hover:dark:text-white transition-all">
        D
      </p>
      <p className="p-2 bg-colorPrimaryDark dark:bg-transparent cursor-pointer text-white dark:text-white group-hover:bg-transparent text-nowrap group-hover:dark:bg-white group-hover:text-zinc-900 group-hover:dark:text-zinc-900 transition-all">
        C
      </p>
    </div>
  ) : (
    <div className="flex justify-center items-center tracking-tight mt-6 font-logo group">
      <p className="p-2 text-6xl bg-transparent dark:bg-white text-zinc-900 dark:text-zinc-900 group-hover:bg-colorPrimaryDark group-hover:dark:bg-transparent group-hover:text-white group-hover:dark:text-white transition-all">
        D A S H
      </p>
      <p className="p-2 text-6xl bg-colorPrimaryDark dark:bg-transparent text-white dark:text-white group-hover:bg-transparent group-hover:dark:bg-white group-hover:text-zinc-900 group-hover:dark:text-zinc-900 transition-all">
        C A S H
      </p>
    </div>
  );
}

export default Logo;
