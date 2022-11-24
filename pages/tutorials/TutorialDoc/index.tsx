import { DataDocList } from "./DataDocList";
import React from "react";

export const TutorialDoc = () => {
  return (
    <div>
      {DataDocList.map((item, index) => (
        <div key={index} className="title text-24 font-bold mb-8">
        <p className="mb-4"> {item.title}</p> 
          <div className="text-16 font-normal space-y-2">
            {item.contents.map((content, index) => {
              return (
                <li className="space-y-3" key={index}>Turn on&nbsp;
                  <a  className="text-[#625DF5]" href="">{content}</a>
                </li>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
