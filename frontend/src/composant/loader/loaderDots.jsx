import { LoaderCircle } from "lucide-react";
import React from "react";

function LoaderDots() {
  return (
    <div className="flex space-x-3 justify-center items-center h-32">
      <LoaderCircle
        strokeWidth={1}
        size={50}
        className="animate-spin animate-fade"
      />
    </div>
  );
}

export default LoaderDots;
