import Image from "next/image";
import SidebarMenus from "./SidebarMenus";

function Sidebar() {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <Image
        height={160}
        width={160}
        alt="logo"
        src="./logo.svg"
        className="mx-auto"
      />
      <div className="flex flex-col gap-4 w-full">
        <SidebarMenus />
      </div>
    </div>
  );
}

export default Sidebar;
