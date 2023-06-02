import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import { useRef, useState } from "react";
import ConfirmModal from "./components/ConfirmModal";
import NewConfirmModal from "./components/NewConfirmModal";

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
        <Test />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const Test = () => {
  const [isOpen, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  function openDialog() {
    if (dialog.current) {
      dialog.current.showModal();
    }
  }

  function closeDialog() {
    if (dialog.current) {
      dialog.current.close();
    }
  }

  return (
    <div className="relative">
      <button
        className="rounded bg-blue-400 px-3 py-1"
        onClick={() => setOpen(true)}>
        Open Old
      </button>

      <button className="rounded bg-blue-400 px-3 py-1" onClick={openDialog}>
        Open New
      </button>

      <ConfirmModal
        open={isOpen}
        title="Hello World"
        cancel={() => setOpen(false)}
        confirm={() => setOpen(false)}
      />

      <NewConfirmModal
        ref={dialog}
        title="Hello World"
        desc="Hello World from this very cool modal"
        cancel={closeDialog}
        confirm={closeDialog}
      />

      {/* <dialog ref={dialog} onClick={handleModalOutsideClick}> */}
      {/*   <p>This is a test for fun</p> */}
      {/*   <button className="rounded bg-blue-400 px-3 py-1" onClick={closeDialog}> */}
      {/*     Close */}
      {/*   </button> */}
      {/* </dialog> */}
    </div>
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
