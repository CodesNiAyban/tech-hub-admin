
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { CourseNavbar } from "./_components/(navbar)/navbar";
import { CourseSidebar } from "./_components/(sidebar)/course-sidebar";
import { ThemeProvider } from "next-themes";
import { checkRole } from "@/lib/role";
import { getProgress } from "@/app/actions/get-progress";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const CourseLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { courseId: string };
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

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
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId,
                        },
                    },
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
    });

    if (!course) {
        return redirect("/");
    }

    const progressCount = await getProgress(userId, course.id);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="h-full">
                <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                    <CourseNavbar course={course} progressCount={progressCount} />
                </div>
                <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                    <CourseSidebar course={course} progressCount={progressCount} />
                </div>
                <main className="md:pl-80 pt-[80px] h-full">
                    {children}
                </main>
            </div>
        </ThemeProvider>
    );
};

export default CourseLayout;