import { siteConfig } from "@/config/site";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { redirect } from "next/navigation";

//TODO: Improve page, add more contents, add animations
export const metadata: Metadata = {
    description: siteConfig.description
};

const MarketingLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <main className="flex h-screen w-full items-center justify-center">
                {children}
            </main>
        </ThemeProvider>
    )
}

export default MarketingLayout;


