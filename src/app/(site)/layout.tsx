import { ReactElement, ReactNode } from "react";

interface HomePageLayoutProps {
  children: ReactNode;
}

function HomePageLayout({ children }: HomePageLayoutProps): ReactElement {
  return <section>{children}</section>;
}

export default HomePageLayout;
