import { Filter } from "lucide-react";

function BtnFilter(props) {
  return (
    <>
      <div className="relative hover:scale-110 transition-all">
        <Filter size={20} className="cursor-pointer" />
        {props.check > 0 ? (
          <>
            <span className="absolute text-xs -top-2 bg-sky-500 rounded-full px-1 animate-pop-up">
              {props.check}
            </span>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default BtnFilter;
