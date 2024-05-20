"use client"

import { teacherRoutes } from "../(sidebar)/sidebar-routes";
import NavBarItem from "./navbar-item";

export const NavBarRoutes = () => {

    return (
        <nav className="grid gap-2 text-lg font-medium">
            {teacherRoutes.map((route) => (
                <NavBarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </nav>
    );
}
