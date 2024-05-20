"use client"

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export const TeacherStudentButton = () => {
    const pathname = usePathname();
    const isPlayerPage = pathname?.includes("/chapter");

    return (
        <div className="flex gap-x-2 ml-auto">
            {isPlayerPage &&
                <Button size="sm" asChild>
                    <Link href="/home">
                        <LogOut className="h-4 w-4 mr-2" />
                        Exit
                    </Link>
                </Button>
            }
        </div>
    );
}
