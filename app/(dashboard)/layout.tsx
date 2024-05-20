import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { checkRole } from "@/lib/role";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { redirect } from "next/navigation";
import DashboardNavBar from "./_components/(navbar)/navbar";
import { SideBar } from "./_components/(sidebar)/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

//TODO: Improve page, add more contents, add animations
export const metadata: Metadata = {
    description: siteConfig.description
};

const MarketingLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    if (!checkRole("admin")) {
        return (
            <div className="flex items-center justify-center h-screen p-10">
                <Card className="w-full sm:w-96">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center">
                            <TriangleAlert className="h-6 w-6 mr-1 text-primary" />
                            Access Denied
                        </CardTitle>
                        <CardDescription className="flex items-center justify-center">
                            You must be an admin to access this page
                        </CardDescription>
                        <Button asChild variant="outline">
                            <Link href="/sign-in">Sign in again</Link>
                        </Button>
                    </CardHeader>
                </Card>
            </div>
        );
    } else {
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
}

export default MarketingLayout;


