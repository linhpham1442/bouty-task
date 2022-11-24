import Image from "next/image";
import React from 'react';

export const Videos = (props:any) => {
  return (
<div className="video border-solid border rounded-20 pb-5 ">
        <Image alt="" src="/svg/icons/img-videos.svg" objectFit="contain" width={379} height={212} />
        <div className="title text-center pt-4 font-bold px-10">{props.title}</div>
        <div className="text-center pt-5">
          <button className="bg-[#625DF5] w-32 rounded-md h-9 text-white">Watch it</button>
        </div>
      </div>  )
}
