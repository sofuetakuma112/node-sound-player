import React from "react";

type ImgProps = {
  src: string;
  alt: string;
};

const Img: React.FC<ImgProps> = ({ src, alt }) => (
  <div className="size-[132px] sm:size-[200px]">
    <img src={src} alt={alt} className="size-full object-cover" />
  </div>
);

const images = [
  "https://contents.oricon.co.jp/upimg/news/2280000/2279726/20230519_185239_p_o_62324597.jpg",
  "https://pbs.twimg.com/media/Fid2xn1akAYW3mt.jpg:large",
  "https://pbs.twimg.com/media/FgyQo7bacAANOJ-.jpg:large",
  "https://pbs.twimg.com/media/FgOGD2kUcAAmXKO.jpg:large",
  "https://img-mdpr.freetls.fastly.net/article/pyg4/nm/pyg4aX6UlPTvhpKa5evj_lCBFVd4RVasH0zLwqB1hcU.jpg",
  "https://img.cdn.nimg.jp/s/nicovideo/thumbnails/41395681/41395681.57120664.original/r1280x720l?key=b09cc8349080d19671e2785399938f9f37eac7759ed47427a9565f78719dccda",
  "https://cdn-ak.f.st-hatena.com/images/fotolife/k/kinekun/20221106/20221106124936.jpg",
  "https://newstisiki.com/wp-content/uploads/2022/10/589c1406930fea6aba23c6828ad35004.jpg",
];

export const InfiniteScroll: React.FC = () => {
  return (
    <div className="w-full inline-flex flex-nowrap">
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-3 sm:[&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
        {images.map((image, i) => (
          <li>
            <Img src={image} key={i} alt={`アーニャ${i}`} />
          </li>
        ))}
      </ul>
      <ul
        className="flex items-center justify-center md:justify-start [&_li]:mx-3 sm:[&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true"
      >
        {images.map((image, i) => (
          <li>
            <Img src={image} key={i} alt={`アーニャ${i}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};
