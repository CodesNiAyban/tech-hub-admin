"use client"
import { adminRoutes } from "../../(routes)/admin/_components/_utils/adminRoutes";
import SideBarItem from "./sidebar-item";

export const SidebarRoutes = () => {

    return (
        <nav className="grid items-start text-sm font-medium lg:px-4">
            {adminRoutes.map((route) => (
                <SideBarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </nav>
    );
}
export { adminRoutes };

