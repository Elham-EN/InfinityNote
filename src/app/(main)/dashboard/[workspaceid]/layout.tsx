import Sidebar from "@/components/sidebar/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: { workspaceid: string };
}

// params must match the dynamic segement
function Layout({ children, params }: LayoutProps): React.ReactElement {
  console.log(params);
  return (
    <main className="flex overflow-hidden h-screen w-screen">
      <Sidebar params={params} />
      <div
        className="dark:border-slate-700 border-l-[1px] w-full 
        relative overflow-scroll"
      >
        {children}
      </div>
    </main>
  );
}

export default Layout;
