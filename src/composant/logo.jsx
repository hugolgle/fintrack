import React from "react";

function Logo({ sidebar }) {
  return sidebar ? (
    <div className="flex justify-center font-logo items-center tracking-tight">
      <p className="p-2 cursor-pointer">D</p>
      <p className="p-2 cursor-pointer">C</p>
    </div>
  ) : (
    <div className="flex justify-center items-center tracking-tight mt-6 font-logo group">
      <p className="p-2 text-6xl ">D A S H</p>
      <p className="p-2 text-6xl ">C A S H</p>
    </div>
  );
}

export default Logo;
