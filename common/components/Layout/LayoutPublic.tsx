import React from "react";
// import Footer from "../Footer";
// import HeaderPublic from "../Header/HeaderPublic";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutPublic: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      <div className="flex">
        <div className="block w-full mx-auto max-w-7xl px-8 2xl:px-0">
          {/* <HeaderPublic isShowToggleTheme={false} /> */}
          <div className="mb-24">{children}</div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default LayoutPublic;
