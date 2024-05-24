"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "@clerk/nextjs/server"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Info, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const columns: ColumnDef<User>[] = [
    // {
    //     accessorKey: "imageUrl",
    //     header: "Profile Image",
    //     cell: ({ row }) => {
    //         const imageUrl = row.getValue("imageUrl");
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
        accessorKey: "username",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Username
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original;
            const imageUrl = row.original.imageUrl;
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
    {
        accessorKey: "emailAddresses",
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
            const emailAddresses = row.getValue("emailAddresses") as { id: string, emailAddress: string }[];
            const primaryEmailAddressId = row.original.primaryEmailAddressId;
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
    {
        id: "actions",
        cell: ({ row }) => {
            const { id } = row.original;

            return (

                <DropdownMenu>
                    <Button variant="ghost" className="h-4 w-8 p-0" asChild>
                        <DropdownMenuTrigger>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                    </Button>
                    <DropdownMenuContent align="end">
                        <Link href={`/admin/users/info/${id}`}>
                            <DropdownMenuItem>
                                <Info className="h-4 w-4 mr-2" /> {/* Add info page */}
                                Info
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
