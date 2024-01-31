import SessionProvider from "./SessionProvider";
import { Footer } from "../components/Footer";
import { Header } from "../components/header/Header";
import HeaderDesktopMenu from "../components/menu/HeaderDesktopMenu";
import "./styles/globals.css";
import type { Metadata } from "next";
import { getServerSession } from "../server/auth";

export const metadata: Metadata = {
  title: {
    template: "%s - Moview",
    default: "Moview ",
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <div className="max-w-8xl mx-auto flex min-h-screen flex-col  bg-mygray-50 px-4 sm:px-6 lg:px-8">
            <Header></Header>
            <div className="flex flex-row md:gap-6 ">
              <HeaderDesktopMenu></HeaderDesktopMenu>
              {children}
            </div>
            <Footer></Footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
