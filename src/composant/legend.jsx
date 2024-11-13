import "./legend.css";

export const renderCustomLegend = (props) => {
  const { payload, topN = 5 } = props;
  const payloadSort = payload.sort(
    (a, b) => b.payload.pourcentage - a.payload.pourcentage
  );
  const payloadTopN = payloadSort.slice(0, topN);

  return (
    <ul className="flex flex-col justify-center w-40">
      {payloadTopN.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center my-1">
          <div
            className="w-[10px] h-[10px] rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-xs gap-1 font-thin italic w-full flex items-center">
            {/* Truncate only entry.value */}
            <span className="truncateCustom">{entry.value} </span>
            {/* Always display the percentage */}
            <span className="w-1/4">
              ({entry.payload.pourcentage.toFixed(2)}%)
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};
