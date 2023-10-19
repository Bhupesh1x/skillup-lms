import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <nav className="h-[80px] md:pl-[25%] lg:pl-[17%] fixed inset-y-0 w-full">
        <Navbar />
      </nav>
      <aside className="hidden md:flex h-full md:w-[25%] lg:w-[17%] flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </aside>
      <main className="w-full md:w-[75%] lg:w-[83%] mt-[80px] p-6 ml-auto">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
