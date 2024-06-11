"use client";
import { CourseProgress } from "@/components/course-progress";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "@clerk/nextjs/server";
import { Course, Purchase } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { UserActions } from "./user-table-actions";

interface ExtendedPurchase extends Purchase {
    user: User;
    chapterProgress: { chapterTitle: string, completed: boolean }[];
    completedCourse: boolean;
    currentChapter: string;
    progressCount: number;
    engagementType: string;
    course: Course;
}

export const columns: ColumnDef<ExtendedPurchase>[] = [
    {
        accessorKey: "user.username",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Username
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const user = row.original.user.username;
            const imageUrl = row.original.user.imageUrl;
            return user ? (
                <div className="flex items-center">
                    <Image
                        src={imageUrl as string}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full mr-4"
                    />
                    {user}
                </div>
            ) : <div>Unknown</div>;
        }
    },
    {
        accessorKey: "user.emailAddresses",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const user = row.original.user;
            const emailAddresses = user?.emailAddresses || [];
            const primaryEmailAddressId = user?.primaryEmailAddressId;
            const email = emailAddresses.find(email => email.id === primaryEmailAddressId)?.emailAddress || "N/A";
            return <span>{email}</span>;
        }
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Purchase Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const createdAt = new Date(row.original.createdAt);
            if (createdAt.toDateString() === "Invalid Date") {
                return <span>No Purchase Record</span>;
            }
            return createdAt.toLocaleString();
        }
    },
    {
        accessorKey: "currentChapter",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Current Chapter
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return <span>{row.original.currentChapter}</span>;
        }
    },
    {
        accessorKey: "completedCourse",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Completed Course
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return <span>{row.original.completedCourse ? "Yes" : "No"}</span>;
        }
    },
    {
        accessorKey: "progressCount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Progress
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return <CourseProgress variant="success" value={row.original.progressCount} />;
        }
    },
    {
        accessorKey: "engagementType",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Engagement Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return <span>{row.original.engagementType}</span>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <Button variant="ghost" className="h-4 w-8 p-0" asChild>
                    <DropdownMenuTrigger>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                </Button>
                <DropdownMenuContent align="end">
                    <div className="flex flex-col">
                        <UserActions courseId={row.original.course.id} userId={row.original.user.id} />
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
