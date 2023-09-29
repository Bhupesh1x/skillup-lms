"use client";

import { Layout, Compass, List, BarChart } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

function SidebarMenus() {
  const pathName = usePathname();

  const isTeacherPage = pathName?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <>
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          href={route.href}
          icon={route.icon}
          label={route.label}
        />
      ))}
    </>
  );
}

export default SidebarMenus;
