import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import DashboardNavBar from "./_components/(navbar)/navbar";
import { SideBar } from "./_components/(sidebar)/sidebar";
import { checkRole } from "@/lib/role";
import NoAccessAdmin from "@/components/no-access-admin";

//TODO: Improve page, add more contents, add animations
export const metadata: Metadata = {
    description: siteConfig.description
};

const MarketingLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    if (!checkRole("admin")) return <NoAccessAdmin />

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] xl:grid-cols-[280px_1fr]">
                <SideBar />
                <div className="relative flex flex-col w-full">
                    <DashboardNavBar />
                    <main className="flex flex-1 flex-col absolute inset-0 gap-4 p-4 overflow-y-auto xl:gap-6 xl:p-6">
                        <ConfettiProvider />
                        <ToastProvider />
                        {children}
                    </main>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default MarketingLayout;


