import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import Button from "./components/Button";

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

const ShowComponents = () => {
  const sizes = ["small", "normal", "large"] as const;
  const varients = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
  ] as const;
  const varientStyles = ["normal", "outline", "text"] as const;

  let buttons = [];

  for (let varientStyle of varientStyles) {
    for (let varient of varients) {
      for (let size of sizes) {
        buttons.push({
          size,
          varient,
          varientStyle,
          label: `${varient}-${size}`,
        });
      }
    }
  }

  return (
    <div className="">
      <div className="grid place-items-center gap-4 sm:grid-cols-3">
        {buttons.map((button) => {
          const { varient, varientStyle, size, label } = button;
          return (
            <Button
              className="max-w-fit"
              varient={varient}
              varientStyle={varientStyle}
              size={size}
              key={`${varient}-${varientStyle}-${size}`}>
              {label}
            </Button>
          );
        })}
      </div>

      <div className="h-10"></div>

      <div className="grid place-items-center gap-4 sm:grid-cols-3">
        {buttons.map((button) => {
          const { varient, varientStyle, size, label } = button;
          return (
            <Button
              className="w-full"
              varient={varient}
              varientStyle={varientStyle}
              size={size}
              key={`${varient}-${varientStyle}-${size}-full`}>
              {label}
            </Button>
          );
        })}
      </div>

      {/* {sizes.map((size) => { */}
      {/*   return ( */}
      {/*     <div className="flex justify-around gap-2" key={size}> */}
      {/*       {varients.map((varient) => { */}
      {/*         return ( */}
      {/*         ); */}
      {/*       })} */}
      {/*     </div> */}
      {/*   ); */}
      {/* })} */}
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
        <Route path="/debug" element={<ShowComponents />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
