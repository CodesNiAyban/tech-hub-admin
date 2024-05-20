import { BarChartBig, BookOpen, Compass, Home, Users } from "lucide-react";

export const teacherRoutes = [
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
        icon: BookOpen,
        label: "Courses",
        href: "/teacher/courses",
    },
    {
        icon: BarChartBig,
        label: "Analytics",
        href: "/teacher/analytics",
    },
    {
        icon: Users,
        label: "Users",
        href: "/admin/users",
    },
] // TODO: Add Customers, Analytics and stuffs