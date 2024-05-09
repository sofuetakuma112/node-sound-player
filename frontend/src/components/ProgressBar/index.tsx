import clsx from "clsx";
import { useEffect, useState } from "react";

const generateColorArray = (steps: number): string[] => {
  const colorArray: string[] = [];
  const orangeValue = 165;
  const step = Math.floor(orangeValue / (steps - 1));

  for (let i = 0; i < steps; i++) {
    const orange = orangeValue - i * step;
    const bgColor = `rgb(255, ${orange}, 0)`;
    colorArray.push(bgColor);
  }

  return colorArray;
};

type Props = {
  value: number;
  className?: string;
};

export const ProgressBar = (props: Props) => {
  const { value, className } = props;
  const [barCount, setBarCount] = useState(0);

  useEffect(() => {
    const calculateBarCount = () => {
      const screenWidth = window.innerWidth;
      const barWidthAndGap = screenWidth >= 640 ? 48 : 20;
      const optimalBarCount = Math.floor(screenWidth / barWidthAndGap);
      console.log("optimalBarCount:", optimalBarCount);
      setBarCount(optimalBarCount);
    };

    calculateBarCount();
    window.addEventListener("resize", calculateBarCount);

    return () => {
      window.removeEventListener("resize", calculateBarCount);
    };
  }, []);

  const bars = Array.from({ length: barCount }, (_, i) => i);
  const colors = generateColorArray(bars.length);

  const calculateBarHeight = (index: number) => {
    const screenWidth = window.innerWidth;
    const maxHeight = screenWidth >= 640 ? 100 : 64;
    const minHeight = screenWidth >= 640 ? 60 : 20;
    const power = screenWidth >= 640 ? 1.8 : 1.4; // 増分の増加率を調整するための指数

    const normalizedIndex = index / (bars.length - 1);
    const height = maxHeight * Math.pow(normalizedIndex, power) + minHeight;
    return `${height}px`;
  };

  return (
    <div
      className={clsx(
        "flex justify-center gap-x-1 sm:gap-4 items-end relative z-30",
        className
      )}
    >
      {bars.map((bar, i) => {
        const coloredBarLength = (value / 100) * bars.length;
        const isColoredBar = i < coloredBarLength - 1;

        return (
          <div
            key={bar}
            className="w-4 sm:w-8 transform skew-x-12"
            style={{
              height: calculateBarHeight(i),
              backgroundColor:
                isColoredBar || value === 100 ? colors[i] : "#CBD5E1",
            }}
          ></div>
        );
      })}
    </div>
  );
};
