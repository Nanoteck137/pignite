import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";

// TODO(patrik):
//  - Edit Project
//  - Edit List Item
//  - Edit List
//  - Modal for creating new list items
//  - Cleanup
//  - Fix desktop
//  - Maybe add a tooltip for project name when its too long or restrict the number of characters

const client = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <PageRoutes />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const PageRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
