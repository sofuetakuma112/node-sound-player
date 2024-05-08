// import fs from "fs";
// import path from "path";
// import axios from "axios";
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const images = [
//   "https://contents.oricon.co.jp/upimg/news/2280000/2279726/20230519_185239_p_o_62324597.jpg",
//   "https://pbs.twimg.com/media/Fid2xn1akAYW3mt.jpg:large",
//   "https://pbs.twimg.com/media/FgyQo7bacAANOJ-.jpg:large",
//   "https://pbs.twimg.com/media/FgOGD2kUcAAmXKO.jpg:large",
//   "https://img-mdpr.freetls.fastly.net/article/pyg4/nm/pyg4aX6UlPTvhpKa5evj_lCBFVd4RVasH0zLwqB1hcU.jpg",
//   "https://img.cdn.nimg.jp/s/nicovideo/thumbnails/41395681/41395681.57120664.original/r1280x720l?key=b09cc8349080d19671e2785399938f9f37eac7759ed47427a9565f78719dccda",
//   "https://cdn-ak.f.st-hatena.com/images/fotolife/k/kinekun/20221106/20221106124936.jpg",
//   "https://newstisiki.com/wp-content/uploads/2022/10/589c1406930fea6aba23c6828ad35004.jpg",
//   "https://www.entax.news/wp-content/uploads/2023/11/1-1.jpg.webp",
//   "https://contents.oricon.co.jp/upimg/news/2231000/2230959/20220407_181329_p_o_1752.jpg",
//   "https://アイレビュー.com/wp-content/uploads/2022/04/2022-04-10-4-890x500.png",
// ];

// const imagesDir = path.join(__dirname, "images");

// // imagesディレクトリが存在しない場合は作成する
// if (!fs.existsSync(imagesDir)) {
//   fs.mkdirSync(imagesDir);
// }

// async function downloadImage(url, filename) {
//   const response = await axios({
//     url,
//     method: "GET",
//     responseType: "stream",
//   });

//   const writer = fs.createWriteStream(filename);

//   response.data.pipe(writer);

//   return new Promise((resolve, reject) => {
//     writer.on("finish", resolve);
//     writer.on("error", reject);
//   });
// }

// async function downloadAllImages() {
//   for (let i = 0; i < images.length; i++) {
//     const url = images[i];
//     const extension = path.extname(url);
//     const filename = path.join(imagesDir, `${i + 1}${extension}`);

//     console.log(`Downloading ${url} to ${filename}`);

//     try {
//       await downloadImage(url, filename);
//       console.log(`Downloaded ${filename}`);
//     } catch (error) {
//       console.error(`Error downloading ${url}: ${error.message}`);
//     }
//   }
// }

// downloadAllImages();

import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const imagesDir = path.join(__dirname, "images");

// imagesディレクトリが存在しない場合は作成する
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

async function downloadImage(url, filename) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const writer = fs.createWriteStream(filename);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function convertToWebp(inputFile, outputFile) {
  await sharp(inputFile)
    .webp()
    .toFile(outputFile);
}

async function downloadAndConvertImage(url, filename) {
  const tempFile = path.join(imagesDir, `temp_${Date.now()}${path.extname(url)}`);

  try {
    await downloadImage(url, tempFile);
    await convertToWebp(tempFile, filename);
    fs.unlinkSync(tempFile);
    console.log(`Downloaded and converted ${filename}`);
  } catch (error) {
    console.error(`Error downloading or converting ${url}: ${error.message}`);
  }
}

async function downloadAllImages() {
  for (let i = 0; i < images.length; i++) {
    const url = images[i];
    const filename = path.join(imagesDir, `${i + 1}.webp`);

    console.log(`Downloading ${url} to ${filename}`);

    await downloadAndConvertImage(url, filename);
  }
}

downloadAllImages();