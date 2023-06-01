import {
  ChevronRightIcon,
  HomeIcon,
  PlusIcon,
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
  useParams,
} from "react-router-dom";
import { getProjectForPage, getProjects } from "./api/api";
import ProjectList from "./components/ProjectList";
import { pb } from "./api/pocketbase";

// TODO(patrik):
//  - Page Transition
//  - Modal for creating new projects
//  - Modal for creating new lists
//  - Modal for creating new list items
//  - Edit Projects
//  - Edit Lists
//  - Edit List Items

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
      <div className="bg-white h-10">
        <div className="container mx-auto bg-pink-200 h-full flex justify-between items-center px-2">
          <Link to="/">
            <HomeIcon className="w-8 h-8 text-black" />
          </Link>
          <button
            onClick={() => {
              console.log("Create ");
            }}>
            <PlusIcon className="w-10 h-10" />
          </button>
        </div>
      </div>

      <div className="container mx-auto">
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
    </div>
  );
};

const ProjectPage = () => {
  const { id } = useParams();

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

  if (isError) return <p className="text-white">Error</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <div className="w-full">
      <div className="bg-white h-10">
        <div className="container mx-auto bg-pink-200 h-full flex justify-between items-center px-2">
          <Link to="/">
            <HomeIcon className="w-8 h-8 text-black" />
          </Link>
          <button
            onClick={() => {
              const name = prompt("List Name");
              if (name) {
                createList.mutate(name);
              }
            }}>
            <PlusIcon className="w-10 h-10" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 container mx-auto">
        <p className="text-white">Project: {data.project.name}</p>
        {data.lists.map((list) => {
          return <ProjectList key={list} listId={list} />;
        })}
      </div>
    </div>
  );
};

export default App;
