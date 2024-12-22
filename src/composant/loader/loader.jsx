import { LoaderCircle } from "lucide-react";
import React from "react";

function Loader() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <LoaderCircle strokeWidth={1} size={50} className=" animate-spin" />
    </div>
  );
}

export default Loader;
