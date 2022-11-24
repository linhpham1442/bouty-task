import React from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { NameChainMapping, SymbolChainMapping } from "@/common/utils";
interface ChainProps {
  defaultTheme?: string;
  className?: string;
}

const Chain: React.FC<ChainProps> = ({ defaultTheme, className }) => {
  const { theme: theme, forcedTheme } = useTheme();
  const router = useRouter();
  const { chain_id } = router.query;
  const chainId = chain_id?.toString();

  let currentTheme = theme;
  if (forcedTheme) {
    currentTheme = forcedTheme;
  }
  if (defaultTheme) {
    currentTheme = defaultTheme;
  }
  
  if (!chainId) {
    return null;
  }
  
  return (
    <Link href="/">
      <div className="flex items-center h-fit">
        <Image
          src={`/svg/coin/${SymbolChainMapping[chainId]}.svg`}
          width={32}
          height={32}
          alt="icon"
        />
        <span className="text-[#2B1C50] text-xl ml-3 font-bold">{NameChainMapping[chainId]}</span>
      </div>
    </Link>
  );
};

export default Chain;
