import Image from "next/image";
import Link from "next/link";
import TutorialDoc from "./TutorialDoc";
import TutorialGit from "./TutorialGit";
import TutorialVideo from "./TutorialVideo";

export default function Tutorials(props:any) {
  return (
    <div className="px-120px">
      <div className=" tutorial-header px-180px">
        <div className="tutorial-header-title text-center flex justify-center text-36 space-x-4">
          <Image alt="" src="/svg/icons/BNB-icon-tutorials.svg" width={52} height={52} />
          <p className="font-bold">How to build on BNB Chain</p>
        </div>
        <div className="tutorial-header-detail pt-7">
          <p className="text-center text-20 ">
            Blockchain tutorials using BNB Chain. Learn how to build Decentralized Applications (Dapps) on BNB Chain and Solidity Smart
            contracts.
          </p>
        </div>
      </div>
      <div className="tutorial-list pt-16">
        <ul className="flex space-x-12 mb-12 text-24 ">
          <Link className="hover:text-[#625DF5] active:text-[#625DF5]" href = "/tutorials/TutorialVideo">Video Series</Link>
          <Link className="hover:text-[#625DF5] active:text-[#625DF5]" href= "/tutorials/TutorialDoc">Tutorial Document</Link>
          <Link className="hover:text-[#625DF5] active:text-[#625DF5]" href= "/tutorials/TutorialGit">Tutorial Git</Link>
        </ul>
        <TutorialVideo />
        <TutorialDoc />
        <TutorialGit />
      </div>
    </div>
  );
}
