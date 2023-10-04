import { Footer } from "./Footer";
import { Header } from "./header/Header";
import HeaderDesktopMenu from "./menu/HeaderDesktopMenu";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="max-w-8xl mx-auto flex min-h-screen flex-col  bg-mygray-50 px-4 sm:px-6 lg:px-8">
        <Header></Header>
        <div className="flex flex-row md:gap-6 ">
          <HeaderDesktopMenu></HeaderDesktopMenu>
          {children}
        </div>
        <Footer></Footer>
      </div>
    </>
  );
};
