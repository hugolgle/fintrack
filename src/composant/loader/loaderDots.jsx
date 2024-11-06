import React from "react";

function LoaderDots() {
  return (
    <div className="flex space-x-3 justify-center items-center h-32">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping delay-0"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping delay-75"></div>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping delay-150"></div>
    </div>
  );
}

export default LoaderDots;
