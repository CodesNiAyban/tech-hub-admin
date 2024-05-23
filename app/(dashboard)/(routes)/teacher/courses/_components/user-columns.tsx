"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatPrice } from "@/lib/format";
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Users } from "lucide-react";
import Link from "next/link";
import { CourseTableActions } from "./course-table-actions";
import { User } from "@clerk/nextjs/server";

interface ExtendedCourse extends Course {
    user: User;
    purchases: { id: string; userId: string; createdAt: Date }[];
}
export const columns: ColumnDef<ExtendedCourse>[] = [
    {
        accessorKey: "user.username",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Username
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const user = row.original.user;
            return user ? <div>{user.username}</div> : <div>Unknown</div>;
        }
    },
];
