import React, { ReactElement } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

function Layout({ children, params }: LayoutProps): ReactElement {
  return <main>{children}</main>;
}

export default Layout;
