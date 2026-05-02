import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppLayout } from "./layout/AppLayout";
import { Loading } from "../shared/ui";
import { ROUTES } from "../shared/config";

const MapPage = lazy(() => import("../modules/map/pages/MapPage"));
const ChatPage = lazy(() => import("../modules/chat/pages/ChatPage"));
const MetricsPage = lazy(() => import("../modules/metrics/pages/MetricsPage"));
const SiniestralidadPage = lazy(() => import("../modules/siniestralidad/pages/SiniestralidadPage"));
const AccessibilityPage = lazy(() => import("../modules/accessibility/pages/AccessibilityPage"));

const L = ({ children }: { children: React.ReactNode }) => <Suspense fallback={<Loading />}>{children}</Suspense>;

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.MAP} replace />} />
        <Route path={ROUTES.MAP} element={<L><MapPage /></L>} />
        <Route path={ROUTES.CHAT} element={<L><ChatPage /></L>} />
        <Route path={ROUTES.METRICS} element={<L><MetricsPage /></L>} />
        <Route path={ROUTES.SINIESTRALIDAD} element={<L><SiniestralidadPage /></L>} />
        <Route path={ROUTES.ACCESSIBILITY} element={<L><AccessibilityPage /></L>} />
      </Route>
    </Routes>
  );
}
