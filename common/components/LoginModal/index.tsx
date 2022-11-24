import Logo from "@/common/components/Header/Logo";
import { Button, ModalProps } from "antd";
import GoogleIcon from "/public/svg/icons/google-24.svg";
import ArrowRghtIcon from "/public/svg/icons/arrow-right-24.svg";
import FacebookIcon from "/public/svg/icons/facebook-24.svg";
import TwitterIcon from "/public/svg/icons/twitter-24.svg";
import { Modal as ModalAntd } from "antd";
import { ReactNode } from "react";

export interface ILoginModalProps {
  isOpen: ModalProps["open"];
  onClose: ModalProps["onCancel"];
  onSelectGoogle: () => void;
  onSelectTwitter: () => void;
  onSelectFacebook: () => void;
}

export default function LoginModal({ isOpen, onClose, onSelectFacebook, onSelectGoogle, onSelectTwitter }: ILoginModalProps) {
  return (
    <ModalAntd open={isOpen} onOk={onClose} onCancel={onClose} footer={null} closable={false} width={"604px"}>
      <div className={"py-[28px] max-w-full flex flex-col items-center"}>
        <Logo />

        <div className="mt-[24px] mb-[27px] text-3xl font-[500] leading-[36px]">Sign in to explore</div>

        <div className="flex flex-col gap-6 w-[336px] max-w-full">
          <ButtonLoginMethod content={"Google"} onClick={onSelectGoogle} icon={<GoogleIcon />} />
          <ButtonLoginMethod content={"Twitter"} onClick={onSelectTwitter} icon={<TwitterIcon />} />
          <ButtonLoginMethod content={"Facebook"} onClick={onSelectFacebook} icon={<FacebookIcon />} />
        </div>
      </div>
    </ModalAntd>
  );
}

export interface IButtonLoginMethodProps {
  onClick: () => void;
  content: string;
  icon: ReactNode;
}

function ButtonLoginMethod({ onClick, content, icon }: IButtonLoginMethodProps) {
  return (
    <Button onClick={onClick} type="text" className={"bg-transparent hover:bg-transparent w-auto h-auto p-0"}>
      <div className="flex px-5 py-3 gap-5 items-center border-[1px] border-[#D8D4E8] rounded">
        {icon}
        <span className="text-base font-medium leading-6">{content}</span>
        <span className="ml-auto">
          <ArrowRghtIcon />
        </span>
      </div>
    </Button>
  );
}
