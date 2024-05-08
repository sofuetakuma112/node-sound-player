import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

interface AnimateProps {
  imgSrc: string;
  startXPosition: number;
}

const Animate = ({ imgSrc, startXPosition }: AnimateProps) => {
  const [hasEnd, setHasEnd] = useState(false);

  const handleOnEnd = useCallback(() => {
    setHasEnd(true);
  }, []);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const target = targetRef.current;

    if (wrapper && target) {
      fly(wrapper, target, startXPosition, handleOnEnd);
    }
  }, [handleOnEnd, startXPosition]);

  if (hasEnd) return null;

  return (
    <div
      className={clsx(
        "w-full h-screen flex overflow-hidden items-end justify-center absolute top-0 left-0"
      )}
    >
      <div className="size-10 sm:size-16 relative top-10 sm:top-16" ref={wrapperRef}>
        <img
          src={imgSrc}
          className="block select-none size-full object-cover"
          alt="image"
          ref={targetRef}
        />
      </div>
    </div>
  );
};

const fly = (
  wrapper: HTMLDivElement,
  target: HTMLImageElement,
  startXPosition: number,
  onEnd: () => void // コールバック関数として`onEnd`を追加
) => {
  const anime = wrapper.animate(
    [
      {
        transform: `translateY(calc(100% + 64px)) translateX(${startXPosition}px)`,
      },
      {
        transform: `translateY(calc(-100vh - 64px)) translateX(${startXPosition}px)`,
      },
    ],
    {
      duration: window.innerHeight * 10,
      iterations: 1,
    }
  );

  const amplitude = { x: 30, rotation: -5 }; // 左右へのウェーブの大きさを調整
  const speed = { x: 0.001 };

  // アニメーションが終了したら`onEnd`関数を呼び出します
  anime.finished.then(onEnd);

  let multiplier = 5;
  let previousTime = performance.now();
  let xRadian = 0;

  const tick = () => {
    const now = performance.now();
    const diff = now - previousTime;

    previousTime = now;
    xRadian += multiplier * speed.x * diff;

    const x = amplitude.x * Math.sin(xRadian);
    const rotation = amplitude.rotation * (1 + Math.sin(xRadian));

    target.style.transform = `rotate(${rotation}deg) translateX(${x}%)`;

    if (anime.playState !== "finished") {
      requestAnimationFrame(tick);
    }
  };

  tick();

  return {
    faster: () => {
      multiplier += 1;
      anime.updatePlaybackRate(multiplier);
    },
  };
};

export default Animate;
