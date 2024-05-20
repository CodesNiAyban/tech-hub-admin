import { LogoPhone } from "@/components/logo-phone"
import { ModeToggle } from "@/components/theme-button"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import {
    Link,
    Loader2,
    Menu
} from "lucide-react"
import { TeacherStudentButton } from "./teacher-student-button"
import CourseMobileSidebar from "../(sidebar)/course-mobile-sidebar"
import { Chapter, Course, UserProgress } from "@prisma/client"

interface CourseNavbarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 duration-1000 animate-in slide-in-from-top-12 z-10 backdrop-blur-sm">
            <CourseMobileSidebar course={course} progressCount={progressCount} />
            <TeacherStudentButton />
            <ModeToggle />
            <ClerkLoading>
                <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
                <SignedOut>
                    <Button size="sm" variant="outline" asChild>
                        <Link href="/sign-in">
                            Login
                        </Link>
                    </Button>
                </SignedOut>
                <SignedIn>
                    <UserButton
                    // afterSignOutUrl="/"
                    />
                </SignedIn>
            </ClerkLoaded>
        </header>
    );
}