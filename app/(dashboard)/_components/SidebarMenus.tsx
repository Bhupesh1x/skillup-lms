"use client";

import { Layout, Compass } from "lucide-react";
import SidebarItem from "./SidebarItem";

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

function SidebarMenus() {
  return (
    <>
      {guestRoutes.map((route) => (
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
