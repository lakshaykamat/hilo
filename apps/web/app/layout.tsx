"use client";
import { usePathname, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import TopBar from "@/components/TopBar";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/NavBar";
import "./globals.css";
import { Sidebar, SidBarMini, BottomBar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isChatsPage = pathname === "/chats";
  const isProfilePage = pathname === "/profile";

  return (
    <html lang="en">
      <head>
        <title>Hilo - Turning moments into memories</title>
        {/* Meta tags */}
      </head>
      <body className={`${inter.className}`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <PageLayout>
              <div
                className={`${
                  !isLoginPage ? "flex flex-col md:flex-row h-screen" : ""
                }`}
              >
                {/* Always render NavBar for Login page */}
                {isLoginPage && <NavBar />}
                {isLoginPage && (
                  <div className="px-4 py-4 sm:px-8 sm:py-8">{children}</div>
                )}
                {/* Main Layout with Sidebar and Content */}
                {!isLoginPage && (
                  <>
                    {!isChatsPage ? <Sidebar /> : <SidBarMini />}
                    <MainContent
                      isLoginPage={isLoginPage}
                      isChatsPage={isChatsPage}
                    >
                      {children}
                    </MainContent>
                    {!isChatsPage && <RightSidebar />}
                  </>
                )}
                {/* Bottom bar visible on all pages (small devices) */}
                <BottomBar />
                <Toaster />
              </div>
            </PageLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/login") return children;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen justify-between items-center outline flex flex-col w-full">
        <div className="basis-full flex items-center justify-center">
          <img src="hilo-logo.png" className="w-[20rem] h-[20rem]" />
        </div>
        <p className="my-4">From Lakshay Kamat</p>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

const MainContent = ({
  children,
  isLoginPage,
  isChatsPage,
}: {
  children: React.ReactNode;
  isLoginPage: boolean;
  isChatsPage: boolean;
}) => {
  return (
    <div
      className={`flex-grow flex-2 ${
        !isLoginPage &&
        `${isChatsPage ? "md:ml-[5rem]" : "md:ml-[15rem]"} ${
          !isChatsPage && "xl:mr-[25rem]"
        }`
      }`}
    >
      {!isLoginPage && <TopBar />}
      <main className="px-4 py-4 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
};

const RightSidebar = () => {
  return (
    <div className="w-[25rem] min-w-[25rem] hidden xl:block fixed right-0 py-28 border-l px-10 h-screen">
      <h2 className="text-lg font-semibold mb-3">Your Friends</h2>
      <div className="flex items-center border hover:cursor-pointer gap-2 py-3 px-3 rounded">
        <img
          src="https://github.com/lakshaykamat.png"
          className="w-10 h-10 rounded-full"
          alt="Friend"
        />
        <h2 className="text-sm">Lakshay Kamat</h2>
      </div>
    </div>
  );
};

export default RootLayout;
