import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_SERVER_URL!}`);

export const Admin = () => {
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
      </div>
    </div>
  );
};
