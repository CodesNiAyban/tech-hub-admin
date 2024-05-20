"use client"

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const TeacherStudentButton = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/course");
    

    return (
        <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isCoursePage ? (
                <Button size="sm" asChild>
                    <Link href="/home">
                        <LogOut className="h-4 w-4 mr-2" />
                        Exit
                    </Link>
                </Button>
            ) : (
                <Button size="sm" asChild>
                    <Link href="/teacher/courses">
                        Teacher Mode
                    </Link>
                </Button>
            )}
        </div>
    );
}
