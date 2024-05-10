import { useEffect, useState } from "react";

export const MaxPercentageImage = () => {
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimationFinished(true);
    }, 2 * 1000);
  }, []);

  return (
    <div className="absolute h-screen top-0 left-0 w-full flex items-center z-50">
      {isAnimationFinished ? (
        <div className="size-full max-h-screen animate-fadein">
          <img
            src="/images/percentages/120.gif"
            alt="ムキムキアーニャ"
            className="size-full object-cover"
          />
        </div>
      ) : (
        <img src="/images/cutin.gif" alt="カットイン" />
      )}
    </div>
  );
};
