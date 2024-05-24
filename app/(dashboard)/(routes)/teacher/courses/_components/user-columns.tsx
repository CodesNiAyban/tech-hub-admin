"use client"
import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

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
            const imageUrl = row.original.user.imageUrl;
            return user ? <div className="flex items-center">
                <Image
                    src={imageUrl as string}
                    alt="Profile"
                    width={40} // Set appropriate width
                    height={40} // Set appropriate height
                    className="h-10 w-10 rounded-full mr-4"
                />
                {user.username}
            </div> : <div>Unknown</div>;
        }
    },
    // {
    //     accessorKey: "user.imageUrl",
    //     header: "Profile Image",
    //     cell: ({ row }) => {
    //         const imageUrl = row.original.user.imageUrl;
    //         return (
    //             <Image
    //                 src={imageUrl as string}
    //                 alt="Profile"
    //                 width={40} // Set appropriate width
    //                 height={40} // Set appropriate height
    //                 className="h-10 w-10 rounded-full"
    //             />
    //         );
    //     }
    // },
    {
        accessorKey: "user.emailAddresses",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const createdAt = new Date(row.getValue("createdAt"));
            return createdAt.toLocaleDateString();
        }
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Updated At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const updatedAt = new Date(row.getValue("updatedAt"));
            return updatedAt.toLocaleDateString();
        }
    },
    {
        accessorKey: "lastSignInAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Sign-In
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const lastSignInAt = new Date(row.getValue("lastSignInAt"));
            return lastSignInAt.toLocaleString();
        }
    },
];
