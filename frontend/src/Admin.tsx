import { Button } from "@/components/ui/button";
import { useState } from "react";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_SERVER_URL!}`);

export const Admin = () => {
  // const socket = io("http://localhost:3000");
  const [maxRequestCount, setMaxRequestCount] = useState<string>("");
  const [coefficient, setCoefficient] = useState<string>("");

  return (
    <div>
      <h1>Admin</h1>
      <div className="flex flex-col gap-y-2">
        <Button
          className="max-w-[240px]"
          onClick={() => {
            socket.emit("reset-progress-bar");
          }}
        >
          プログレスバーをリセット
        </Button>
        <Button
          className="max-w-[240px]"
          onClick={() => {
            socket.emit("lock-update-progress");
          }}
        >
          プログレスバーを更新不可にする
        </Button>
        <Button
          className="max-w-[240px]"
          onClick={() => {
            socket.emit("unlock-update-progress");
          }}
        >
          プログレスバーを更新可能にする
        </Button>
        <div>
          <input
            type="text"
            value={maxRequestCount}
            onChange={(e) => setMaxRequestCount(e.target.value)}
            className="border-2"
          />
          <Button
            className="max-w-[240px]"
            onClick={() => {
              socket.emit("update-max-request-count", maxRequestCount);
            }}
          >
            Max Requestを変更する
          </Button>
        </div>
        <div>
          <input
            type="text"
            value={coefficient}
            onChange={(e) => setCoefficient(e.target.value)}
            className="border-2"
          />
          <Button
            className="max-w-[240px]"
            onClick={() => {
              socket.emit("update-coefficient", coefficient);
            }}
          >
            係数を変更する
          </Button>
        </div>
      </div>
    </div>
  );
};
