"use client"

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export const TeacherStudentButton = () => {
    const pathname = usePathname();
    const { userId } = useAuth();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isPlayerPage = pathname?.includes("/chapter");
    const isAdmin = pathname?.includes("/admin");

    return (
        <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isPlayerPage || isAdmin ? (
                <Button size="sm" asChild>
                    <Link href="/home">
                        <LogOut className="h-4 w-4 mr-2" />
                        Exit
                    </Link>
                </Button>
            ) : userId ? (
                <Button size="sm" asChild>
                    <Link href="/teacher/courses">
                        Teacher Mode
                    </Link>
                </Button>
            ) : null}
        </div>
    );
}
