import Image from "next/image";
import React from "react";
import { Videos } from "./Videos";

export const TutorialVideo = () => {
  return (
    <div className="">
      <div className="video col-span-3 grid">
      <Image alt="" src="/svg/icons/img-videos-2.svg" objectFit="cover" width={1200} height={456} className = "rounded-20" />
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 mt-12 gap-8 ">
      <Videos title = "Detailed Explanation to the EVM Model" />
      <Videos title = "The Solidity Programming Language – 1" />
      <Videos title = "The Solidity Programming Language – 2.1" />
      <Videos title = "The Solidity Programming Language – 2.2" />
      <Videos title = "Real-world Solidity Smart Contract Examples - 1.1" />
      <Videos title = "Real-world Solidity Smart Contract Examples - 1.2" />
    </div>
    </div>
  );
};
