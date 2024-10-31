import React from "react";

function LoaderBis() {
  return (
    <div className="flex space-x-2 justify-center items-center h-[200px]">
      <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-ping delay-0"></div>
      <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-ping delay-75"></div>
      <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-ping delay-150"></div>
    </div>
  );
}

export default LoaderBis;
