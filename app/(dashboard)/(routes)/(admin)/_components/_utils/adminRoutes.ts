import { BaggageClaim, BarChartBig, BookOpen, Users } from "lucide-react";

export const adminRoutes = [
    {
        icon: BookOpen,
        label: "Courses",
        href: "/teacher/courses",
    },
    {
        icon: Users,
        label: "Users",
        href: "/",
    },
    {
        icon: BarChartBig,
        label: "Analytics",
        href: "/teacher/analytics",
    },
    {
        icon: BaggageClaim,
        label: "Pricing",
        href: "/pricing",
    },
] // TODO: Add Customers, Analytics and stuffs