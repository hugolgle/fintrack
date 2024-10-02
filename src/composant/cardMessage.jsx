import { useState, useEffect } from "react";

function CardMessage(props) {
  const [animationClass, setAnimationClass] = useState("animate__fadeInUp");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationClass("animate__fadeOutRight");
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed p-4 ${props.color} bottom-4 max-w-60 rounded right-4 flex justify-center transition-all items-center animate__animated ${animationClass}`}
    >
      <p>{props.message}</p>
    </div>
  );
}

export default CardMessage;
