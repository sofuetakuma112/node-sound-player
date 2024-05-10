import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import { useCallback, useEffect, useState } from "react";
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

type SignInFormProps = {
  onSuccess: () => void;
};

const SignInForm: React.FC<SignInFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="userName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="userName"
                  name="userName"
                  id="userName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                  required={true}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                onClick={() => {
                  if (name === "24fresh" && password === "24fresh") {
                    onSuccess();
                  }
                }}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                ログイン
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

function App() {
  const [animations, setAnimations] = useState<React.ReactElement[]>([]);
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [canUpdateProgress, setCanUpdateProgress] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [anyaLine, setAnyaLine] = useState<{
    line: string;
    soundLength: number;
  } | null>(null);

  const [hasAuthed, setHasAuthed] = useState(false);
  const handleSuccess = useCallback(() => {
    setHasAuthed(true);
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

  if (!hasAuthed) return <SignInForm onSuccess={handleSuccess} />;

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
