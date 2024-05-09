import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_SERVER_URL!}`);

export const Admin = () => {
  return (
    <div>
      <h1>Admin</h1>
      <Button
        onClick={() => {
          socket.emit("reset-progress-bar");
        }}
      >
        プログレスバーをリセット
      </Button>
    </div>
  );
};
