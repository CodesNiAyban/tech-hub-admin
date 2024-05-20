"use client"

import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavBarItemProps {
    icon: LucideIcon;
    label: string,
    href: string;
}

const NavBarItem = ({
    icon,
    label,
    href
}: NavBarItemProps) => {
    const pathname = usePathname();
    const Icon = icon;

    const isActive =
        (pathname === "/dashboard" && href === "/dashboard") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

    return (
        <SheetClose asChild>
            <Link
                href={href}
                className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                    isActive && "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-muted-foreground hover:text-foreground",
                )}
            >
                <Icon className="h-5 w-5" />
                {label}
            </Link>
        </SheetClose>
    );
}

export default NavBarItem;