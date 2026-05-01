import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <main className="ml-16">
        <Outlet />
      </main>
    </div>
  );
}
