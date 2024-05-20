"user client"
import { LogoPhone } from "@/components/logo-phone"
import { ModeToggle } from "@/components/theme-button"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import {
    Loader2,
    Menu
} from "lucide-react"
import { MobileSubscriptionCard } from "../(sidebar)/mobile-subscription-card"
import { NavBarRoutes } from "./navbar-routes"
import SearchComponent from "./search"
import { TeacherStudentButton } from "./teacher-student-button"
import Link from "next/link"
import { checkRole } from "@/lib/role"
import toast from "react-hot-toast"

export const DashboardNavBar = () => {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 duration-1000 animate-in slide-in-from-top-12 z-10 backdrop-blur-sm">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <LogoPhone />
                    <NavBarRoutes />
                    <div className="mt-auto">
                        <MobileSubscriptionCard />
                    </div>
                </SheetContent>
            </Sheet>
            <div className="w-full flex items-center gap-x-3 justify-between bg-transparent"> {/* Added flex and justify-between classes */}
                <div className="flex-1 bg-transparent"> {/* Added flex-1 class to make it take remaining space */}
                    <SearchComponent />
                </div>
                <TeacherStudentButton />
                <ModeToggle />
                <ClerkLoading>
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <SignedOut>
                    <Button size="sm" variant="outline" asChild>
                        <Link href="/sign-in">
                            Login
                        </Link>
                    </Button>
                </SignedOut>
                <ClerkLoaded>
                    <SignedIn>
                        <UserButton
                        // afterSignOutUrl="/"
                        />
                    </SignedIn>
                </ClerkLoaded>
            </div>
        </header>
    );
}

export default DashboardNavBar;