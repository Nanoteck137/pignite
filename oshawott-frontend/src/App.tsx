import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink } from "@trpc/client";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import DebugPage from "./pages/Debug";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import { trpc } from "./trpc";

// TODO(patrik):
//  - Edit Project
//  - Edit List Item
//  - Edit List
//  - Modal for creating new list items
//  - Cleanup
//  - Fix desktop
//  - Maybe add a tooltip for project name when its too long or restrict the number of characters

let apiUrl = window.location.origin;
if (import.meta.env.DEV && import.meta.env.VITE_APP_API_URL) {
  apiUrl = import.meta.env.VITE_APP_API_URL;
}

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${apiUrl}/trpc`,
    }),
  ],
});

const App = () => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PageRoutes />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const PageRoutes = () => {
  const location = useLocation();
  const isDev = import.meta.env.DEV;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectPage />} />

        {isDev && <Route path="/debug" element={<DebugPage />} />}
      </Routes>
    </AnimatePresence>
  );
};

export default App;
