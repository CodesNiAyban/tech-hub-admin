"use client"

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string,
    href: string;
}

const SideBarItem = ({
    icon,
    label,
    href
}: SidebarItemProps) => {
    const pathname = usePathname();
    const Icon = icon;

    const isActive =
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

        //TODO: Try to study screen sizes tailwind for cleaner code

    return (
        <Link
            href={href}
            className={cn("flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary ",
                isActive && "flex items-center gap-3 rounded-lg bg-muted px-3 py-3 text-primary transition-all hover:text-primary",
            )}
        >
            <Icon className="h-6 w-6" />
            {label}
        </Link>
    );
}

export default SideBarItem;