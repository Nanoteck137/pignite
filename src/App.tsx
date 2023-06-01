import {
  ArrowLeftIcon,
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
//  - Cleanup

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
      <div className="bg-white h-14 elevation-6">
        <div className="h-full flex justify-between items-center container mx-auto bg-slate-700 px-4">
          <Link to="/">
            <HomeIcon className="w-8 h-8 text-white" />
          </Link>
          <button
            onClick={() => {
              console.log("Create ");
            }}>
            <PlusIcon className="w-10 h-10 text-white" />
          </button>
        </div>
      </div>

      <div className="h-10"></div>

      <div className="container mx-auto px-4">
        {data.map((item) => {
          return (
            <Link
              className="flex items-center justify-between rounded bg-purple-500 hover:bg-purple-400 elevation-4"
              to={`/project/${item.id}`}
              key={item.id}>
              <span className="text-left max-w-[75%] truncate text-lg ml-4 text-white">
                {item.name}
              </span>
              <ChevronRightIcon className="w-12 h-12 text-white" />
            </Link>
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
      <div className="bg-white h-14 elevation-6">
        <div className="h-full flex justify-between items-center container mx-auto bg-slate-700 px-4">
          <Link to="/">
            <ArrowLeftIcon className="w-8 h-8 text-white" />
          </Link>

          <p className="text-white text-lg">{data.project.name}</p>
          <button
            onClick={() => {
              const name = prompt("List name");
              if (name) {
                createList.mutate(name);
              }
            }}>
            <PlusIcon className="w-10 h-10 text-white" />
          </button>
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
    </div>
  );
};

export default App;
