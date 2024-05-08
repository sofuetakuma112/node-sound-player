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

app.use(express.json());
app.use(cors());

io.on('connection', (socket) => {
    console.log('A user connected');
  
    // `play-sound`リクエスト処理をソケットイベントハンドラに移動
    socket.on('play-sound', () => {
      player.play({
        path: 'sample.wav',
      })
      .then(() => {
        socket.broadcast.emit('soundPlayed'); // リクエスト元以外にイベントを発行
        console.log("Sound played and event broadcasted to other clients");
      })
      .catch((error) => {
        console.error(`Error playing sound: ${error}`);
      });
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });


httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});