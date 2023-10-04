import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex">
      <nav className="h-[80px] md:pl-[25%] lg:pl-[17%] fixed inset-y-0 w-full">
        <Navbar />
      </nav>
      <aside className="h-full hidden md:flex flex-col inset-y-0 z-50 md:w-[25%] lg:w-[17%]">
        <Sidebar />
      </aside>
      <main className="w-full md:w-[75%] lg:w-[83%] mt-[80px] p-6">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
