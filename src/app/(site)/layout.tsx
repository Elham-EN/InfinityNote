import { ReactElement, ReactNode } from "react";
import Header from "@/components/landing-page/header";

interface HomePageLayoutProps {
  children: ReactNode;
}

function HomePageLayout({ children }: HomePageLayoutProps): ReactElement {
  return (
    <main className=" md:space-y-32 mb-16">
      <Header />
      {children}
    </main>
  );
}

export default HomePageLayout;
