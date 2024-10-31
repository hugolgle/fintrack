import React from "react";

function Loader() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div class="border-2 border-black border-t-transparent dark:border-2 dark:border-white dark:border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
    </div>
  );
}

export default Loader;
