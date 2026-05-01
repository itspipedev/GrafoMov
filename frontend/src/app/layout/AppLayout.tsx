import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Sidebar />
      <main className="ml-[72px]">
        <Outlet />
      </main>
    </div>
  );
}
