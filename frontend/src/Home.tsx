import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Animate from "./Animate";

const socket = io(`${import.meta.env.VITE_SERVER_URL!}`);

const images = [
  "/images/1.webp",
  "/images/2.webp",
  "/images/3.webp",
  "/images/4.webp",
  "/images/5.webp",
  "/images/6.webp",
  "/images/7.webp",
  "/images/8.webp",
  "/images/9.webp",
  "/images/10.webp",
  "/images/11.webp",
];

function getWidthPercentage(currentWidth: number, percentage: number) {
  return (currentWidth * percentage) / 100;
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomImage(images: string[]): string {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

function App() {
  const [animations, setAnimations] = useState<React.ReactElement[]>([]);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // イベントリスナーを設定して、soundPlayedイベントが来たらAnimateコンポーネントを追加する
    socket.on("soundPlayed", () => {
      const animationContainer = document.getElementById("animation-container");
      if (animationContainer && animationContainer.children.length <= 20) {
        setAnimations((prevAnimations) => [
          ...prevAnimations,
          <Animate
            key={Date.now()}
            startXPosition={getWidthPercentage(width, getRandomNumber(-40, 40))}
            imgSrc={getRandomImage(images)}
          />,
        ]);
      }
    });

    // コンポーネントがアンマウントされるとき、または依存関係が変更された時にイベントリスナーをクリーンアップ
    return () => {
      socket.off("soundPlayed");
    };
  }, [width]);

  const handlePlaySound = async () => {
    socket.emit("play-sound"); // サーバーに 'play-sound' イベントを送信
    console.log("Sound play request sent");
  };

  return (
    <div className="min-h-screen flex flex-col p-8 sm:p-16 overflow-x-hidden bg-[#F4F4F4]">
      <h1 className="relative z-30 text-4xl mb-4 sm:mb-8 text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Sound Player
      </h1>
      <div id="animation-container">{animations}</div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <Button
          onClick={handlePlaySound}
          className="w-[180px] sm:w-[256px] sm:text-lg relative z-30"
        >
          アーニャを応援する
        </Button>
      </div>
    </div>
  );
}

export default App;
