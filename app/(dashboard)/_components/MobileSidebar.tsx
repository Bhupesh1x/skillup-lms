import { Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "../../../components/ui/sheet";
import Sidebar from "./Sidebar";

function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
        <SheetContent side="left" className="p-0 bg-white max-w-[50%]">
          <Sidebar />
        </SheetContent>
      </SheetTrigger>
    </Sheet>
  );
}

export default MobileSidebar;
