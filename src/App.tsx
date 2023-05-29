import { Dialog } from "@headlessui/react";
import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/20/solid";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { CreateTodo, Todo } from "./interfaces/todo";
import TodoItem from "./components/TodoItem";
import ViewLists from "./components/ViewLists";
import { fetchList } from "./api/fetch";
import api from "./api/api";

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
    <QueryClientProvider client={client}>
      <Site />
    </QueryClientProvider>
  );
};

interface ViewFolder {
  mode: "view-folder";
  folderId: number;
}

interface Home {
  mode: "home";
}

type PageState = Home | ViewFolder;

const Site = () => {
  const [page, setPage] = useState<PageState>({ mode: "home" });

  function setPageState(newState: PageState) {
    setPage(newState);
  }

  return (
    <div className="overflow-x-hidden">
      <AnimatePresence mode="wait">
        {page.mode == "home" && (
          <HomePage key={"home"} setPageState={setPageState} />
        )}
        {page.mode == "view-folder" && (
          <ViewFolderPage
            key={"view-folder"}
            listId={page.folderId}
            setPageState={setPageState}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const HomePage = ({
  setPageState,
}: {
  setPageState: (newState: PageState) => void;
}) => {
  return (
    <motion.div
      className="container mt-2 mx-auto"
      initial={{ x: "-150%" }}
      animate={{ x: 0 }}
      exit={{ x: "-150%" }}
      transition={{ type: "spring", duration: 0.4 }}>
      <CreateNewFolder />
      <div className="h-4"></div>
      <ViewLists
        onFolderClick={(folderId) => {
          setPageState({ mode: "view-folder", folderId });
        }}
      />
    </motion.div>
  );
};

type ViewFolderPageProps = {
  listId: number;
  setPageState: (newState: PageState) => void;
};

function useList(id: number) {
  return useQuery({
    queryKey: ["lists", id],
    queryFn: () => fetchList(id),
  });
}

const ViewFolderPage = ({ listId, setPageState }: ViewFolderPageProps) => {
  const { data, isError, isLoading } = useList(listId);

  const [isCreateTodoOpen, setCreateTodoOpen] = useState(false);
  const contentInputRef = useRef<HTMLInputElement>(null);

  // TODO(patrik): Disable form submition when sending request
  const createTodo = useMutation({
    mutationFn: (todo: CreateTodo) => {
      return api.createTodo(todo);
    },
    onSettled: () => {
      client.invalidateQueries(["lists", listId]);
    },
    onSuccess: () => {
      closeCreateTodo();
    },
  });

  if (isError) return <p>Error</p>;
  if (isLoading) return <p>Loading...</p>;

  function closeCreateTodo() {
    setCreateTodoOpen(false);
  }

  function openCreateTodo() {
    setCreateTodoOpen(true);
  }

  function createNewTodo() {
    if (contentInputRef.current) {
      const content = contentInputRef.current.value;
      createTodo.mutate({ content, listId, done: false });
    }
  }

  return (
    <motion.div
      initial={{ x: "150%" }}
      animate={{ x: 0 }}
      exit={{ x: "150%" }}
      transition={{ type: "spring", duration: 0.4 }}>
      <div className="flex items-center justify-between h-16 bg-white pr-2">
        <button
          className="text-white"
          onClick={() => setPageState({ mode: "home" })}>
          <ChevronLeftIcon className="text-black w-14 h-14" />
        </button>
        <button className="text-white" onClick={() => console.log("Add")}>
          <PlusIcon className="text-black w-12 h-12" />
        </button>
      </div>
      <button
        className="w-full rounded py-2 bg-red-400 text-white"
        onClick={openCreateTodo}>
        New Todo
      </button>

      <div className="flex flex-col gap-2">
        {data.todos.map((item) => {
          return <TodoItem key={item.id} id={item.id} />;
        })}
      </div>

      <Dialog open={isCreateTodoOpen} onClose={closeCreateTodo}>
        <div className="fixed inset-0 bg-black opacity-75"></div>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="bg-blue-500">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createNewTodo();
                }}>
                {/* <label> */}
                {/*   <span>Content: </span> */}
                {/* </label> */}
                <input name="haha" ref={contentInputRef} type="text" />
              </form>
              <button
                className="bg-pink-400 rounded px-2 py-1"
                onClick={() => createNewTodo()}>
                New Todo
              </button>
              <button
                className="bg-pink-400 rounded px-2 py-1"
                onClick={closeCreateTodo}>
                Close
              </button>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </motion.div>
  );
};

const CreateNewFolder = () => {
  return (
    <button className="bg-red-400 w-full rounded py-2 text-lg">
      New Folder
    </button>
  );
};

// const App = () => {
//   return (
//     <div>
//       <Test />
//     </div>
//   );
// };

// const Background = (props: PropsWithChildren<{ test?: boolean }>) => {
//   return (
//     <div
//       className={`relative overflow-y-auto overflow-x-hidden h-screen v-full ${
//         props.test ? "bg-purple-400" : "bg-gray-800"
//       }`}>
//       {props.children}
//     </div>
//   );
// };

// const Test = () => {
//   const [test, setTest] = useState<Test>({ mode: "closed" });
//
//   return (
//     <Background>
//       <AnimatePresence mode="wait">
//         {test.mode == "closed" ? (
//           <Test2
//             key={"test2"}
//             onClick={() =>
//               setTest({
//                 mode: "viewtodo",
//                 todoId: Math.floor(Math.random() * 100),
//               })
//             }
//           />
//         ) : (
//           <Test3
//             key={"test3"}
//             todo={test.todoId}
//             onClick={() => setTest({ mode: "closed" })}
//           />
//         )}
//       </AnimatePresence>
//     </Background>
//   );
// };
//
// const Test2 = (props: { onClick: () => void }) => {
//   return (
//     <motion.div
//       initial={{ x: "100%" }}
//       animate={{ x: 0 }}
//       exit={{ x: "100%" }}
//       transition={{ duration: 0.2 }}>
//       <button className="rounded px-3 py-1 bg-blue-600" onClick={props.onClick}>
//         Change
//       </button>
//     </motion.div>
//   );
// };
//
// const Test3 = (props: { todo: number; onClick: () => void }) => {
//   return (
//     <motion.div
//       initial={{ x: "-100%" }}
//       animate={{ x: 0 }}
//       exit={{ x: "-100%" }}
//       transition={{ duration: 0.2 }}>
//       <div className="flex items-center h-12 bg-gray-500">
//         <button onClick={props.onClick}>
//           <ChevronLeftIcon className="w-12 h-12 text-red-500" />
//         </button>
//       </div>
//       <p>This is a test for fun</p>
//       <p>Todo: {props.todo}</p>
//     </motion.div>
//   );
// };

// const TodoItem = (props: { id: number }) => {
//   const { error, data } = useQuery({
//     queryKey: ["todo", props.id],
//     queryFn: () => api.getTodo({ params: { id: props.id } }),
//   });
//
//   const done = useMutation({
//     mutationFn: (done: boolean) =>
//       api.updateTodo({ done: done }, { params: { id: props.id } }),
//     onSettled: () => client.invalidateQueries(["todo", props.id]),
//   });
//
//   const content = useMutation({
//     mutationFn: (content: string) =>
//       api.u
