import classNames from "classnames";
import { useEffect, useState } from "react";

function CountDown({
  countDownDistance,
  className = "",
}: {
  countDownDistance: number;
  className?: string;
}) {
  const [countdown, setCountdown] = useState(0);

  const addZero = (num: number) => {
    return num < 10 ? "0" + num : num;
  };

  useEffect(() => {
    let interval = null as any;
    if (countDownDistance) {
      let countdown = countDownDistance;
      interval = setInterval(() => {
        countdown = countdown - 1000;
        if (countdown < 0) {
          clearInterval(interval);
        } else {
          setCountdown(countdown);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [countDownDistance]);

  let days = Math.floor(countdown / (1000 * 60 * 60 * 24));
  let hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((countdown % (1000 * 60)) / 1000);

  return (
    <section
      className={classNames("font-medium ml-2 bg-[#EFF0FF]  rounded-md px-3 py-1 inline-block", {
        [className]: className,
      })}
    >
      {addZero(days)} : {addZero(hours)} : {addZero(minutes)} : {addZero(seconds)}
    </section>
  );
}

export default CountDown;
