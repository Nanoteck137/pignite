import { Dialog } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { CreateTodo } from "./interfaces/todo";
import TodoItem from "./components/TodoItem";
import ViewLists from "./components/ViewLists";
import { CreateList } from "./interfaces/list";
import PocketBase from "pocketbase";
import { z } from "zod";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { getProjectById, getProjectLists, getProjects } from "./api/api";

// TODO(patrik):
//   - Page Transition Animation
//   - Modal Animation
//
//   - Todos:
//     - Fetch
//     - Create
//     - Edit
//     - Delete
//   - Folders:
//     - Fetch
//     - Create
//     - Edit
//     - Delete
//
//   - Style Cleanup
//   - Mobile
//   - Desktop

const client = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const HomePage = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isError) return <p className="text-white">Error</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <div>
      {data.map((item) => {
        return (
          <div key={item.id}>
            <Link
              className="flex items-center justify-between rounded bg-blue-500"
              to={`/project/${item.id}`}>
              <span className="text-left max-w-[75%] truncate text-lg ml-4">
                {item.name}
              </span>
              <ChevronRightIcon className="w-12 h-12" />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

const ProjectPage = () => {
  const { id } = useParams();
  const project = useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id || ""),
    enabled: !!id,
  });

  const lists = useQuery({
    queryKey: ["projects", id, "lists"],
    queryFn: () => getProjectLists(id || ""),
    enabled: !!project.data,
  });

  if (project.isError || lists.isError) return <p>Error</p>;
  if (project.isLoading || lists.isLoading) return <p>Loading...</p>;

  return (
    <div className="text-white">
      <p>Project: {project.data.name}</p>
      {lists.data.map((item) => {
        return (
          <div key={item.id}>
            <p className="text-white">{item.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default App;
