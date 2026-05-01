import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";

export function AppLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0" }}>
      <Sidebar />
      <main style={{ marginLeft: 72 }}>
        <Outlet />
      </main>
    </div>
  );
}
