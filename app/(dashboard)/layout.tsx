import Sidebar from "./_components/Sidebar";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex">
      <aside className="h-full hidden md:flex flex-col inset-y-0 z-50 md:w-[25%] lg:w-[17%]">
        <Sidebar />
      </aside>
      <main className="w-full md:w-[75%] lg:w-[83%]">{children}</main>
    </div>
  );
}

export default AppLayout;
