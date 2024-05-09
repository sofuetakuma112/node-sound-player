import clsx from "clsx";
import { useCallback } from "react";

type Props = {
  imageSources: {
    [key in number]: string;
  };
  value: number;
};

export const ImageSynchronWithPercentage = ({ imageSources, value }: Props) => {
  const getImageSource = useCallback(
    (value: number) => {
      const thresholds = Object.keys(imageSources)
        .map(Number)
        .sort((a, b) => a - b);

      for (let i = 0; i < thresholds.length; i++) {
        if (value < thresholds[i]) {
          return imageSources[thresholds[i]];
        }
      }

      return imageSources[thresholds[thresholds.length - 1]];
    },
    [imageSources]
  );

  return (
    <div className={clsx("flex-1 flex justify-center bg-no-repeat", {
        "bg-top": value === 100,
        "bg-center": value !== 100
    })} style={{
        backgroundImage: `url(${getImageSource(value)})`
    }}>
      {/* <img
        src={getImageSource(value)}
        alt="image by percentage"
        className="object-cover object-top h-full"
      /> */}
    </div>
  );
};
