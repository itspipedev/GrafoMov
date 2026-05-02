import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="ml-[72px]"><Outlet /></main>
    </div>
  );
}
