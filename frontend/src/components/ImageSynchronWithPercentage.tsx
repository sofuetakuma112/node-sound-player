import clsx from "clsx";
import { useCallback, useMemo } from "react";

type Props = {
  imageSources: {
    [key in number]: string;
  };
  value: number;
};

export const ImageSynchronWithPercentage = ({ imageSources, value }: Props) => {
  const getImageSourceKey = useCallback(
    (value: number) => {
      const thresholds = Object.keys(imageSources)
        .map(Number)
        .sort((a, b) => a - b);

      for (let i = 0; i < thresholds.length; i++) {
        if (value < thresholds[i]) {
          return thresholds[i];
        }
      }

      return thresholds[thresholds.length - 1];
    },
    [imageSources]
  );

  const lastKey = useMemo(
    () =>
      Object.keys(imageSources)
        .map(Number)
        .sort((a, b) => a - b)
        .pop(),
    [imageSources]
  );

  return (
    <div className="flex-1 flex flex-col">
      {Object.keys(imageSources).map((key) => (
        <div
          className={clsx("flex-1 justify-center bg-no-repeat", {
            "bg-top": lastKey === Number(key),
            "bg-center": lastKey !== Number(key),
            flex: Number(key) === getImageSourceKey(value),
            hidden: Number(key) !== getImageSourceKey(value),
          })}
          style={{
            backgroundImage: `url(${imageSources[Number(key)]})`,
          }}
          key={key}
        ></div>
      ))}
    </div>
  );

  // return (
  //   <div className={clsx("flex-1 flex justify-center bg-no-repeat", {
  //       "bg-top": value === 100,
  //       "bg-center": value !== 100
  //   })} style={{
  //       backgroundImage: `url(${getImageSource(value)})`
  //   }}>
  //   </div>
  // );
};
