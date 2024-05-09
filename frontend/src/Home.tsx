import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Animate from "./Animate";
import { ProgressBar } from "./components/ProgressBar";
import { ImageSynchronWithPercentage } from "./components/ImageSynchronWithPercentage";

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
  const [currentPercentage, setCurrentPercentage] = useState(0);
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

    socket.on("progressUpdate", (currentPercentage) => {
      setCurrentPercentage(currentPercentage);
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
    <div className="min-h-screen max-h-screen flex flex-col py-4 sm:py-8 px-8 sm:px-16 xl:px-32 2xl:px-64 overflow-x-hidden bg-[#F4F4F4]">
      <h1 className="relative z-30 text-2xl sm:text-4xl mb-8 sm:mb-12 text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        ボタンを連打してアーニャを応援しよう！
      </h1>
      <ProgressBar value={currentPercentage} className="mb-4 sm:mb-8" />
      <p className="sm:text-xl mb-4 sm:mb-8">現在{currentPercentage}%</p>
      <div className="flex flex-col items-center pb-4 sm:pb-8">
        <Button
          onClick={handlePlaySound}
          className="w-[180px] sm:w-[256px] sm:text-lg relative z-30"
        >
          アーニャを応援する
        </Button>
      </div>
      <div id="animation-container">{animations}</div>
      <ImageSynchronWithPercentage
        value={currentPercentage}
        imageSources={{
          20: "/images/percentages/20.gif", // 無
          40: "/images/percentages/40.gif", // トレーニング
          60: "/images/percentages/60.gif",
          80: "/images/percentages/80.gif", //
          100: "/images/percentages/100.gif", // 覚醒
          120: "/images/percentages/120.gif", // ムキムキ
        }}
      />
      {/* <ImageSlider imgSrc="https://img.cdn.nimg.jp/s/nicovideo/thumbnails/42951925/42951925.21906384.original/r1280x720l?key=ced2491820f99a8ec5ecf7a83641887e5071efe2595b931046dcba8dca4cf712" /> */}
      {/* <div id="animation-container">{animations}</div> */}
    </div>
  );
}

export default App;
