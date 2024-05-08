import express from "express";
import player from "node-wav-player";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/play-sound", (req, res) => {
  player
    .play({
      path: "sample.wav",
    })
    .then(() => {
      res.status(200).send("Sound played successfully");
    })
    .catch((error) => {
      console.error(`exec error: ${error}`);
      res.status(500).send("Error playing sound");
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
