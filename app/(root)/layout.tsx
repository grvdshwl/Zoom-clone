import React, { FC, ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return <main>{children}</main>;
};

export default RootLayout;
