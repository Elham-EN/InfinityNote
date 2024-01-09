import { ReactElement, ReactNode } from "react";

interface HomePageLayoutProps {
  children: ReactNode;
}

function HomePageLayout({ children }: HomePageLayoutProps): ReactElement {
  return <section className=" px-[0px]">{children}</section>;
}

export default HomePageLayout;
