import useChainId from "@/common/hooks/useChainId";
import { longAddress, SymbolChainMapping } from "@/common/utils";
import { Button } from "@mantine/core";
import classNames from "classnames";
import { Copy } from "iconsax-react";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";

interface AccountDropdownProps {
  userAddress: string;
  currentWallet: string;
  onDisconnect: () => void;
  className?: string;
}
const AccountDropdown = (props: AccountDropdownProps) => {
  const chainId = useChainId();
  const { userAddress, currentWallet, onDisconnect, className } = props;

  const handleCopied = () => {
    toast.success("Copied!");
  };

  return (
    <div
      className={classNames({
        [className]: className,
      })}
    >
      <div className="mb-3 text-2xl font-semibold ">
        {currentWallet} {SymbolChainMapping[chainId]}
      </div>
      <div className="flex justify-between gap-4 mb-2">
        <span className="text-sm font-normal ">{userAddress ? longAddress(userAddress) : ""}</span>
        <CopyToClipboard text={userAddress ? userAddress : ""} onCopy={handleCopied}>
          <div className="flex items-center cursor-pointer">
            <Copy size="20" color="#FFFFFF" />
          </div>
        </CopyToClipboard>
      </div>
      <div className="flex justify-between gap-4 mb-6">
        <span className="font-medium  text-sm">Connected with metamask</span>
        <img src="/svg/meta-mask.svg" />
      </div>
      <Button onClick={onDisconnect} fullWidth color="red" size="md">
        Disconnect Wallet
      </Button>
    </div>
  );
};

export default AccountDropdown;
