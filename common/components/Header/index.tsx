import React, { memo } from "react";
import NavBar from "./NavBar";

interface HeaderProps {
  isShowToggleTheme: boolean;
}
const Header: React.FC<HeaderProps> = ({ isShowToggleTheme = true }) => {
  return (
    <header className="flex">
      <NavBar isShowToggleTheme={isShowToggleTheme} />
    </header>
  );
};

export default memo(Header);
