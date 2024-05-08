import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Animate from "./Animate";

const socket = io(`${import.meta.env.VITE_SERVER_URL!}`);

const images = [
  "https://contents.oricon.co.jp/upimg/news/2280000/2279726/20230519_185239_p_o_62324597.jpg",
  "https://pbs.twimg.com/media/Fid2xn1akAYW3mt.jpg:large",
  "https://pbs.twimg.com/media/FgyQo7bacAANOJ-.jpg:large",
  "https://pbs.twimg.com/media/FgOGD2kUcAAmXKO.jpg:large",
  "https://img-mdpr.freetls.fastly.net/article/pyg4/nm/pyg4aX6UlPTvhpKa5evj_lCBFVd4RVasH0zLwqB1hcU.jpg",
  "https://img.cdn.nimg.jp/s/nicovideo/thumbnails/41395681/41395681.57120664.original/r1280x720l?key=b09cc8349080d19671e2785399938f9f37eac7759ed47427a9565f78719dccda",
  "https://cdn-ak.f.st-hatena.com/images/fotolife/k/kinekun/20221106/20221106124936.jpg",
  "https://newstisiki.com/wp-content/uploads/2022/10/589c1406930fea6aba23c6828ad35004.jpg",
  "https://www.entax.news/wp-content/uploads/2023/11/1-1.jpg.webp",
  "https://contents.oricon.co.jp/upimg/news/2231000/2230959/20220407_181329_p_o_1752.jpg",
  "https://アイレビュー.com/wp-content/uploads/2022/04/2022-04-10-4-890x500.png",
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
