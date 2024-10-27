import React from "react";
import "./loader.css";

function Loader() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div class="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
