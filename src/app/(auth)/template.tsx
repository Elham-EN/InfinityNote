import Header from "@/components/landing-page/header";
import React from "react";

interface TemplateProps {
  children: React.ReactNode;
}

function Template({ children }: TemplateProps): React.ReactElement {
  return (
    <>
      <div className="h-screen p-6 flex items-center justify-center">
        {children}
      </div>
    </>
  );
}

export default Template;
