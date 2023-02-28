import { Footer } from "./Footer";
import { Header } from "./Header";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-[100vh] min-w-[100vw] bg-mygray-100 px-4 font-sans">
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
};
