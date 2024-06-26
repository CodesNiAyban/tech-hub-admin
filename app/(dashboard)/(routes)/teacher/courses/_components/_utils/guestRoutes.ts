import { BaggageClaim, BarChartBig, BookOpen, Compass, Home, Settings, Users } from "lucide-react";

export const guestRoutes = [
    {
        icon: Home,
        label: "Dashboard",
        href: "/home",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/",
    },
    {
        icon: BaggageClaim,
        label: "Pricing",
        href: "/pricing",
    },
    {
        icon: Settings,
        label: "Settings",
        href: "/user-profile",
    },
] // TODO: Add Customers, Analytics and stuffs