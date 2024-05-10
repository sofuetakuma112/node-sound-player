import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Animate from "./Animate";
import { ProgressBar } from "./components/ProgressBar";
import { ImageSynchronWithPercentage } from "./components/ImageSynchronWithPercentage";
import { MaxPercentageImage } from "./components/MaxPercentageImage";

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

const cutInAnimeDuration = 2 * 1000;

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
  const [canUpdateProgress, setCanUpdateProgress] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anyaLine, setAnyaLine] = useState<{
    line: string;
    soundLength: number;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/check-auth${
            token ? `?token=${encodeURIComponent(token)}` : ""
          }`,
          {
            headers: {
              Authorization: `Basic ${btoa(
                `${import.meta.env.VITE_BASIC_AUTH_USERNAME}:${
                  import.meta.env.VITE_BASIC_AUTH_PASSWORD
                }`
              )}`,
            },
          }
        );

        console.log(await response.text());

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

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
    socket.on("canUpdateProgress", (canUpdateProgress) => {
      console.log("canUpdateProgress:", canUpdateProgress);
      setCanUpdateProgress(canUpdateProgress);
    });
    socket.on("playedAnyaLines", ({ line, soundLength }) => {
      setAnyaLine({ line, soundLength });
      setTimeout(() => {
        setAnyaLine(null);
      }, 1 * 1000 + soundLength * 1000);
    });

    // コンポーネントがアンマウントされるとき、または依存関係が変更された時にイベントリスナーをクリーンアップ
    return () => {
      socket.off("soundPlayed");
      socket.off("progressUpdate");
      socket.off("canUpdateProgress");
    };
  }, [width]);

  const handlePlaySound = async () => {
    socket.emit("play-sound"); // サーバーに 'play-sound' イベントを送信
    console.log("Sound play request sent");
  };

  if (!isAuthenticated) {
    return <div>認証が必要です</div>;
  }

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
          disabled={!canUpdateProgress}
        >
          アーニャを応援する
        </Button>
      </div>
      <div id="animation-container">{animations}</div>
      <ImageSynchronWithPercentage
        value={currentPercentage}
        imageSources={{
          20: "/images/percentages/20.gif", // シャードー
          40: "/images/percentages/40.gif", // 走り込み
          60: "/images/percentages/60.gif", // 腹筋
          80: "/images/percentages/80.gif", // 命をかけた腹筋
          101: "/images/percentages/100.gif", // 覚醒
          // 120: "/images/percentages/120.gif", // ムキムキ
        }}
      />
      {currentPercentage >= 100 && (
        <MaxPercentageImage duration={cutInAnimeDuration} />
      )}
      {anyaLine != null && (
        <div className="w-full px-4 fixed bottom-4 sm:bottom-8 text-black left-1/2 -translate-x-2/4 z-[100] bg-white">
          <p>{anyaLine.line}</p>
        </div>
      )}
    </div>
  );
}

export default App;
