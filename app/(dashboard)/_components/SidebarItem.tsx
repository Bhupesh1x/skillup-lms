"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  href: string;
  label: string;
  icon: LucideIcon;
};

function SidebarItem({ href, icon: Icon, label }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  function handleOnClick() {
    router.push(href);
  }

  return (
    <button
      onClick={handleOnClick}
      className={`flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 h-full transition-all hover:text-slate-600 hover:bg-slate-300/20 ${
        isActive &&
        "text-sky-700 bg-sky-200/20 hover:text-sky-700 hover:bg-sky-200/20 font-semibold"
      }`}
    >
      <div className="flex h-full items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={`text-slate-500 ${isActive && "text-sky-700"}`}
        />
        {label}
      </div>
      <div
        className={`h-[3rem] opacity-0 border-sky-700 ml-auto border-2 transition-all ${
          isActive && "opacity-100"
        } `}
      />
    </button>
  );
}

export default SidebarItem;
