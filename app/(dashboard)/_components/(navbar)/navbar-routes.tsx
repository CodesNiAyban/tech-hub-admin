"use client"

import NavBarItem from "./navbar-item";
import { guestRoutes } from "../(sidebar)/sidebar-routes";

export const NavBarRoutes = () => {
    const routes = guestRoutes;

    return (
        <nav className="grid gap-2 text-lg font-medium">
            {routes.map((route) => (
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
