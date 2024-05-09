import React from "react";

type Props = {
  value: number;
};

export const Progress: React.FC<Props> = ({ value }) => {
  return (
    <div className="relative h-5 rounded-full overflow-hidden bg-gray-300">
      <div
        className="transition-all absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
