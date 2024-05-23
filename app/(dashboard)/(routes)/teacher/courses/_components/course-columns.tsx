"use client";

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
    categories: { name: string }[];
    chapters: { isPublished: boolean; position: number }[];
    user: User;
    purchases: { id: string; userId: string; createdAt: Date }[];
}

export const columns: ColumnDef<ExtendedCourse>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price") || "0");
            return (
                <div>
                    {formatPrice(price)}
                </div>
            );
        }
    },
    {
        accessorKey: "isPublished",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Published
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const isPublished = row.getValue("isPublished") || false;
            return (
                <Badge variant={isPublished ? "success" : "yellow"}>
                    {isPublished ? "Published" : "Draft"}
                </Badge>
            );
        }
    },
    {
        accessorKey: "user.username",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created By
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const user = row.original.user;
            return user ? <div>{user.username}</div> : <div>Unknown</div>;
        }
    },
    {
        accessorKey: "purchases",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Purchases
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const purchases = row.original.purchases;
            return (
                <div>
                    {purchases.length} Purchases
                </div>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { id } = row.original;
            const course = row.original;

            const requiredFields = [
                course.title,
                course.description,
                course.imageUrl,
                course.price,
                course.categories.length > 0,
                course.chapters.some(chapter => chapter.isPublished),
            ];

            const isComplete = requiredFields.every(Boolean);

            return (
                <DropdownMenu>
                    <Button variant="ghost" className="h-4 w-8 p-0" asChild>
                        <DropdownMenuTrigger>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                    </Button>
                    <DropdownMenuContent align="end">
                        <div className="flex flex-col">
                            <Link href={`/teacher/courses/${id}`}>
                                <DropdownMenuItem>
                                    <Pencil className="h-4 w-4 mr-2 ml-1" />
                                    Edit
                                </DropdownMenuItem>
                            </Link>
                            <Link href={`/teacher/courses/${id}/users`}>
                                <DropdownMenuItem>
                                    <Users className="h-4 w-4 mr-2 ml-1" />
                                    Users
                                </DropdownMenuItem>
                            </Link>
                            <CourseTableActions
                                isComplete={isComplete}
                                courseId={id}
                                isPublished={course.isPublished}
                            />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];