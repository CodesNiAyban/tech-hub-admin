"use client";
import { CourseProgress } from "@/components/course-progress";
import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
import { Course, Purchase } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

interface ExtendedPurchase extends Purchase {
    user: User;
    chapterProgress: { chapterTitle: string, completed: boolean }[];
    completedCourse: boolean;
    currentChapter: string;
    progressCount: number; // Add progressCount to the interface
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
            const user = row.original.user;
            const imageUrl = user?.imageUrl;
            return user ? (
                <div className="flex items-center">
                    <Image
                        src={imageUrl as string}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full mr-4"
                    />
                    {user.username}
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
    }
];