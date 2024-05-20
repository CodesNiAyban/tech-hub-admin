"use client"

import { teacherRoutes } from "../../(routes)/teacher/courses/_components/_utils/admin-routes";
import SideBarItem from "./sidebar-item";

export const SidebarRoutes = () => {

    return (
        <nav className="grid items-start text-sm font-medium lg:px-4">
            {teacherRoutes.map((route) => (
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
export { teacherRoutes };

