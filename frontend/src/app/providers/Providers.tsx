import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={qc}>
        {children}
        <Toaster position="top-right" toastOptions={{ style: { background: "#1e293b", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.06)" } }} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
