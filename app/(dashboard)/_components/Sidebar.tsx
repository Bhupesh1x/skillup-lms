import Image from "next/image";
import SidebarMenus from "./SidebarMenus";

function Sidebar() {
  return (
    <div className="overflow-y-auto h-full border-r shadow min-h-screen">
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
