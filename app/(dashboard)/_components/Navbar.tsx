import NavbarRoutes from "@/components/NavbarRoutes";
import MobileSidebar from "./MobileSidebar";

function Navbar() {
  return (
    <div className="p-4 flex items-center bg-white shadow-sm h-full border-b">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
}

export default Navbar;
