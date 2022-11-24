import React, { memo, useCallback, useEffect, useState } from "react";

import { Burger } from "@mantine/core";
import Chain from "./Chain";
import Logo from "./Logo";
import MenuHeader from "./Menu";
import Web3 from "web3";
import classNames from "classnames";
import { useAuth } from "@/common/hooks/useAuth";
import { useRouter } from "next/router";

interface NavBarProps {
  isShowToggleTheme: boolean;
}
const NavBar: React.FC<NavBarProps> = ({ isShowToggleTheme = true }) => {
  const { user: address } = useAuth();
  const router = useRouter();
  const [currentWallet, setCurrentWallet] = useState<string>("0");
  const [open, setOpen] = useState(false);

  const onClickMenu = () => {
    setOpen(!open);
  };

  const getBalance = useCallback(async (address: string) => {
    try {
      const web3 = new Web3(Web3.givenProvider);
      let response = await web3.eth.getBalance(address);

      if (response) {
        let wallet = Web3.utils.fromWei(response, "ether");
        let walletParsed = parseFloat(wallet)?.toFixed(4);
        setCurrentWallet(walletParsed);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  useEffect(() => {
    if (address) {
      getBalance(address);
    }
  }, [getBalance, address]);

  // const isClubDetailPage = router.pathname?.includes("/invest-club/[id]");
  const notIncludeSidebar = ["/bounty-task/create","/tutorials", "/top-tasks", "/callback/google", "callback/facebook"].includes(router.pathname);

  const includeHeader = ["/top-tasks", "/", "/tutorials"].includes(router.pathname);
  return (
    <nav
      className={classNames("w-full py-6 overflow-auto z-100 sm:relative sm:m-auto", {
        fixed: open,
      })}
    >
      <div className="relative justify-between sm:flex sm:gap-36 mx-10">
        <div className="flex items-center  justify-between w-full shrink-0 grow-0">
          {notIncludeSidebar ? <Logo /> : <div />}

          {/* <Burger
            className="sm:hidden text-white-spinel sm:text-[#13172B]"
            opened={open}
            onClick={onClickMenu}
          /> */}
          {includeHeader && (
            <MenuHeader
              className={classNames("sm:flex items-center justify-between sm:relative sm:gap-10", {
                // hidden: !open,
              })}
              currentWallet={currentWallet}
              isShowToggleTheme={isShowToggleTheme}
            />
          )}
        </div>
        {/* <MenuHeader
          className={classNames(
            "sm:flex items-center justify-between sm:relative sm:gap-10",
            {
              hidden: !open,
            }
          )}
          currentWallet={currentWallet}
          isShowToggleTheme={isShowToggleTheme}
        /> */}
      </div>
    </nav>
  );
};

export default memo(NavBar);
