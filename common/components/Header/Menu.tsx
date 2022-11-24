import { Button, Popover } from "@mantine/core";
import { Dropdown, Menu, notification } from "antd";
import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import LoginModal from "@/common/components/LoginModal";
import { useAuth } from "@/common/hooks/useAuth";
import { useRouter } from "next/router";

// import SwitchTheme from "../shared/SwitchTheme";

interface MenuHeaderProps {
  className?: string;
  toggleOpen?: () => void;
  currentWallet: string;
  isShowToggleTheme: boolean;
}
const MenuHeader: React.FC<MenuHeaderProps> = (props) => {
  const { className, currentWallet } = props;
  const { logout, user, isAuthenticated, profile } = useAuth();
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [open, setOpen] = useState(false);
  const { loginWithFacebook, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    setIsOpenLoginModal(true);
  };

  const handleSelectLoginTwitter = () => {
    notification.info({
      message: "Comming soon",
      key: "cs",
      placement: "top",
      duration: 1,
      maxCount: 1,
    });
  };

  const menu = (
    <Menu
      className="w-full"
      items={[
        {
          label: "Logout",
          key: "1",
          onClick: () => {
            logout();
          },
        },
      ]}
    />
  );

  return (
    <div className={className}>
      <div className="tutorials flex space-x-2">
        <Image alt="" src="/svg/icons/BNB-icon-tutorials.svg" width={24} height={24} objectFit="contain" />
        <Link href="/tutorials">How to build on BNB Chain</Link>
      </div>
      <div className="relative mt-0">
        <Popover
          opened={open}
          onClose={() => setOpen(false)}
          target={
            !isAuthenticated ? (
              <Button onClick={handleLogin} size="md">
                <div className="flex items-center justify-center text-base">
                  <span className="whitespace-nowrap">Login</span>
                </div>
              </Button>
            ) : (
              <Dropdown.Button
                type="primary"
                overlay={menu}
                onClick={() => {
                  router.push("/profile");
                }}
              >
                {profile.display_name}
              </Dropdown.Button>
            )
          }
          position="bottom"
        >
          <></>
        </Popover>
      </div>

      <LoginModal
        isOpen={isOpenLoginModal}
        onSelectGoogle={loginWithGoogle}
        onSelectFacebook={loginWithFacebook}
        onSelectTwitter={handleSelectLoginTwitter}
        onClose={() => {
          setIsOpenLoginModal(false);
        }}
      />
    </div>
  );
};

export default MenuHeader;
