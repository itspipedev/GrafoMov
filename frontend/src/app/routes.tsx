import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppLayout } from "./layout/AppLayout";
import { Loading } from "../shared/ui";
import { ROUTES } from "../shared/config";

const MapPage = lazy(() => import("../modules/map/pages/MapPage"));
const ChatPage = lazy(() => import("../modules/chat/pages/ChatPage"));
const MetricsPage = lazy(() => import("../modules/metrics/pages/MetricsPage"));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.MAP} replace />} />
        <Route path={ROUTES.MAP} element={<Lazy><MapPage /></Lazy>} />
        <Route path={ROUTES.CHAT} element={<Lazy><ChatPage /></Lazy>} />
        <Route path={ROUTES.METRICS} element={<Lazy><MetricsPage /></Lazy>} />
        <Route path={ROUTES.SINIESTRALIDAD} element={<Lazy><MapPage /></Lazy>} />
        <Route path={ROUTES.ACCESSIBILITY} element={<Lazy><MapPage /></Lazy>} />
      </Route>
    </Routes>
  );
}
