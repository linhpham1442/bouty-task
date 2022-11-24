import React from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import classNames from "classnames";

interface LogoProps {
  defaultTheme?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ defaultTheme, className }) => {
  const { theme: theme, forcedTheme } = useTheme();
  let currentTheme = theme;
  if (forcedTheme) {
    currentTheme = forcedTheme;
  }
  if (defaultTheme) {
    currentTheme = defaultTheme;
  }

  return (
    <Link href="/">
      <span
        className={classNames("flex items-center transition-all cursor-pointer hover:scale-105", {
          [className]: className,
        })}
      >
        {currentTheme === "light" ? (
          // <img src="/svg/logo-spinel-dark.svg" className="h-[45px] mx-auto" />
          // <img src="/svg/logo-spinel-beta.svg" className="h-[45px] mx-auto" />
          <img src="/svg/logo-spinel.svg" className="h-[45px] mx-auto" />
        ) : (
          <img src="/svg/logo-spinel.svg" className="h-[50px] mx-auto" />
        )}
      </span>
    </Link>
  );
};

export default Logo;
