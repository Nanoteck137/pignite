import {
  ArrowLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getProjectForPage, getProjects } from "./api/api";
import ProjectList from "./components/ProjectList";
import { pb } from "./api/pocketbase";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import CreateModal from "./components/CreateModal";
import Dropdown from "./components/Dropdown";
import ConfirmModal from "./components/ConfirmModal";

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

const HomePage = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const createProject = useMutation({
    mutationFn: (name: string) =>
      pb.collection("projects").create({ name, color: "#ff00ff" }),
    onSettled: () => client.invalidateQueries(["projects"]),
  });

  if (isError) return <p className="text-white">Error</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0" }}
      exit={{ x: "-100%" }}>
      <div className="bg-white h-14 elevation-6">
        <div className="h-full flex justify-between items-center container mx-auto bg-slate-700 px-4">
          <Link to="/">
            <HomeIcon className="w-8 h-8 text-white" />
          </Link>
          <button
            onClick={() => {
              setCreateModalOpen(true);
            }}>
            <PlusIcon className="w-10 h-10 text-white" />
          </button>
        </div>
      </div>

      <div className="h-10"></div>

      <div className="flex flex-col gap-2 container mx-auto px-4">
        {data.map((item) => {
          return (
            <Link
              className="flex items-center justify-between rounded bg-purple-500 hover:bg-purple-400 elevation-4 p-2"
              to={`/project/${item.id}`}
              key={item.id}>
              <span className="flex-grow text-left text-lg text-white ml-2">
                {item.name}
              </span>
              <ChevronRightIcon className="min-w-[3rem] h-12 text-white" />
            </Link>
          );
        })}
      </div>

      <CreateModal
        title="New Project"
        open={isCreateModalOpen}
        close={() => setCreateModalOpen(false)}
        create={(name) => createProject.mutate(name)}
      />
    </motion.div>
  );
};

const ProjectPage = () => {
  const { id } = useParams();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectForPage(id || ""),
    enabled: !!id,
  });

  const createList = useMutation({
    mutationFn: (name: string) =>
      pb.collection("lists").create({ name, project: id }),
    onSettled: () => client.invalidateQueries(["project", id]),
  });

  const deleteProject = useMutation({
    mutationFn: () => pb.collection("projects").delete(id || ""),
    onSuccess: () => navigate("/"),
    onSettled: () => client.invalidateQueries(["projects"]),
  });

  if (isError) return <p className="text-white">Error</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <motion.div
      className="w-full"
      initial={{ x: "-100%" }}
      animate={{ x: "0" }}
      exit={{ x: "-100%" }}>
      <div className="bg-white h-14 elevation-6">
        <div className="h-full flex justify-between items-center container mx-auto bg-slate-700 px-4">
          <Link to="/">
            <ArrowLeftIcon className="w-8 h-8 text-white" />
          </Link>

          <p className="truncate text-white text-lg px-4">
            {data.project.name}
          </p>

          <Dropdown
            iconSize="8"
            items={[
              {
                name: "New List",
                icon: <PlusIcon className="w-6 h-6" />,
                onClick: () => setCreateModalOpen(true),
              },
              {
                name: "Edit Project",
                icon: <PencilSquareIcon className="w-6 h-6" />,
              },
              {
                name: "Delete Project",
                type: "red",
                icon: <TrashIcon className="w-6 h-6" />,
                onClick: () => setConfirmDeleteModalOpen(true),
              },
            ]}
          />
        </div>
      </div>

      <div className="h-10"></div>

      <div className="flex flex-col gap-2 container mx-auto px-2">
        {data.lists.map((list) => {
          return (
            <ProjectList key={list} projectId={data.project.id} listId={list} />
          );
        })}
      </div>

      <ConfirmModal
        open={isConfirmDeleteModalOpen}
        title="Are you sure?"
        desc="You are about to delete the project!"
        cancelTitle="Cancel"
        confirmTitle="Delete"
        cancel={() => setConfirmDeleteModalOpen(false)}
        confirm={() => {
          deleteProject.mutate();
          setConfirmDeleteModalOpen(false);
        }}
      />

      <CreateModal
        title="New List"
        open={isCreateModalOpen}
        close={() => setCreateModalOpen(false)}
        create={(name) => createList.mutate(name)}
      />
    </motion.div>
  );
};

export default App;
