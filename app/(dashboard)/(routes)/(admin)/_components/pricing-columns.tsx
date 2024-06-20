"use client"
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Info, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { EditPriceDialog } from "./set-price-dialog";
import { SubscriptionPrices } from "@prisma/client";
import { formatPrice } from "@/lib/format";

export const pricingColumns: ColumnDef<SubscriptionPrices>[] = [
    {
        accessorKey: "name",
        header: "Plan",
        cell: ({ row }) => <span>{row.getValue("name")}</span>,
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <span>{formatPrice(row.getValue("price"))}</span>,
    },
    {
        accessorKey: "recurring",
        header: "Billing Interval",
        cell: ({ row }) => <span>{row.getValue("recurring")}</span>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            // Example: Get the SubscriptionPrices object from row
            const subscriptionPrice: SubscriptionPrices = row.original;

            return (
                <DropdownMenu>
                    <Button variant="ghost" className="h-4 w-8 p-0" asChild>
                        <DropdownMenuTrigger>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                    </Button>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <EditPriceDialog initialData={subscriptionPrice} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
