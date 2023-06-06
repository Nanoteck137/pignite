import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import DebugPage from "./pages/Debug";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import { trpc } from "./trpc";
import { useRef } from "react";
import { getQueryKey } from "@trpc/react-query";

// TODO(patrik):
//  - Edit Project
//  - Edit List Item
//  - Edit List
//  - Modal for creating new list items
//  - Cleanup
//  - Fix desktop
//  - Maybe add a tooltip for project name when its too long or restrict the number of characters

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
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
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const PageRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/debug" element={<DebugPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
