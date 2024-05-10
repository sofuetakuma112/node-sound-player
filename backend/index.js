import express from "express";
import player from "node-wav-player";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";

const app = express();
const port = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // 本番環境では適切なオリジンに設定してください
  },
});

const calcCurrentPercentage = (requestsCount) =>
  Math.min(Math.floor((requestsCount / maxRequests) * 100), 100);

const playSound = (socket, fileName) =>
  player.play({ path: fileName }).then(() => {
    socket.broadcast.emit("soundPlayed"); // リクエスト元以外にイベントを発行
    console.log("Sound played and event broadcasted to other clients");
  });

let totalRequests = 0;
const maxRequests = 100;
let resetTimer = null;

let canUpdateProgress = true;

// 各パーセンテージの再生フラグ
let played5 = false;
let played20 = false;
let played40 = false;
let played60 = false;
let played80 = false;
let played100 = false;

app.use(express.json());
app.use(cors());

app.get("/api/check-auth", (req, res, next) => {
  const token = req.query.token;
  const decodeedToken = decodeURIComponent(token);

  if (decodeedToken === process.env.QR_CODE_TOKEN) {
    // QRコードからのアクセスの場合はBasic認証をスキップ
    res.status(200).send("Authentication successful");
  } else {
    res.status(401).send("Authentication failed");
  }
});

app.get("/admin/reset-progress-bar", (req, res) => {
  res.send("Progress bar reset successfully");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  const percentage = calcCurrentPercentage(totalRequests);
  socket.emit("progressUpdate", percentage);
  socket.emit("canUpdateProgress", canUpdateProgress);

  // `play-sound`リクエスト処理をソケットイベントハンドラに移動
  socket.on("play-sound", () => {
    if (!canUpdateProgress) return;

    totalRequests++;

    const percentage = calcCurrentPercentage(totalRequests);

    if (percentage === 100) {
      io.emit("progressUpdate", 100);

      // タイマーをクリアして新しいタイマーを設定
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        totalRequests = 0;
        io.emit("progressUpdate", 0);
        // 再生フラグをリセット
        played20 = false;
        played40 = false;
        played60 = false;
        played80 = false;
        played100 = false;
      }, 30 * 1000);
    } else {
      io.emit("progressUpdate", percentage);
    }

    // パーセンテージに応じて音声ファイルを再生
    if (percentage >= 5 && !played5) {
      playSound(socket, "5.m4a");
      played5 = true;
    } else if (percentage >= 20 && !played20) {
      playSound(socket, "20.m4a");
      played20 = true;
    } else if (percentage >= 40 && !played40) {
      playSound(socket, "40.m4a");
      played40 = true;
    } else if (percentage >= 60 && !played60) {
      playSound(socket, "60.m4a");
      played60 = true;
    } else if (percentage >= 80 && !played80) {
      playSound(socket, "80.m4a");
      played80 = true;
    } else if (percentage === 100 && !played100) {
      playSound(socket, "100.m4a");
      played100 = true;
    }
  });

  socket.on("lock-update-progress", () => {
    canUpdateProgress = false;
    io.emit("canUpdateProgress", false);
  });

  socket.on("unlock-update-progress", () => {
    canUpdateProgress = true;
    io.emit("canUpdateProgress", true);
  });

  socket.on("reset-progress-bar", () => {
    totalRequests = 0;
    clearTimeout(resetTimer);
    io.emit("progressUpdate", 0);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
