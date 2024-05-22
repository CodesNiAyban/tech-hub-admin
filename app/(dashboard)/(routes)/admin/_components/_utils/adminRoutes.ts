import { BarChartBig, BookOpen, Compass, Home, Users } from "lucide-react";

export const adminRoutes = [
    {
        icon: BookOpen,
        label: "Courses",
        href: "/teacher/courses",
    },
    {
        icon: Users,
        label: "Users",
        href: "/admin/users",
    },
    {
        icon: BarChartBig,
        label: "Analytics",
        href: "/teacher/analytics",
    },
] // TODO: Add Customers, Analytics and stuffs