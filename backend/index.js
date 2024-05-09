import express from "express";
import player from "node-wav-player";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const port = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // 本番環境では適切なオリジンに設定してください
  },
});

let totalRequests = 0;
const maxRequests = 100;

app.use(express.json());
app.use(cors());

app.get("/admin/reset-progress-bar", (req, res) => {
  res.send("Progress bar reset successfully");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // `play-sound`リクエスト処理をソケットイベントハンドラに移動
  socket.on("play-sound", () => {
    totalRequests++;

    if (totalRequests >= maxRequests) {
      totalRequests = maxRequests;
      io.emit("progressUpdate", 100);
    } else {
      const percentage = Math.floor((totalRequests / maxRequests) * 100);
      io.emit("progressUpdate", percentage);
    }

    player
      .play({
        path: "sample.wav",
      })
      .then(() => {
        socket.broadcast.emit("soundPlayed"); // リクエスト元以外にイベントを発行
        console.log("Sound played and event broadcasted to other clients");
      })
      .catch((error) => {
        console.error(`Error playing sound: ${error}`);
      });
  });

  socket.on("reset-progress-bar", () => {
    totalRequests = 0;
    io.emit("progressUpdate", 0);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
