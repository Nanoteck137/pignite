import { Dialog, Menu } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Zodios } from "@zodios/core";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { z } from "zod";

// TODO(patrik):
//   - Page Transition Animation
//   - Fetch Folders
//   - Fetch Todos
//   - Create Todos
//   - Create Folders
//   - Delete Todos
//   - Delete Folders
//   - Edit Todos
//   - Edit Folders
//   - Style Cleanup
//   - Mobile
//   - Desktop

const Todo = z.object({
  id: z.number(),
  content: z.string().min(1),
  done: z.boolean().default(false),
  listId: z.number(),
});
type Todo = z.infer<typeof Todo>;

const CreateTodo = Todo.omit({ id: true });
type CreateTodo = z.infer<typeof CreateTodo>;

const TodoPatch = z.object({
  content: z.string().min(1).optional(),
  done: z.boolean().optional(),
});

const Id = z.object({
  id: z.number(),
});
type Id = z.infer<typeof Id>;

const List = z.object({
  id: z.number(),
  name: z.string(),
  todos: z.array(Id),
});

const CreateList = List.omit({ id: true, todos: true });
type CreateList = z.infer<typeof CreateList>;

const api = new Zodios("http://127.0.0.1:6969/api/v1", [
  {
    method: "get",
    path: "/list",
    alias: "getAllLists",
    description: "Get all the lists",
    response: z.array(List),
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "get",
    path: "/list/:id",
    alias: "getList",
    description: "Get single list",
    response: List,
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "get",
    path: "/todo/:id",
    alias: "getTodo",
    description: "Get single todo",
    response: Todo,
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "patch",
    path: "/todo/:id",
    alias: "updateTodo",
    description: "Update todo",
    parameters: [
      {
        name: "todo",
        type: "Body",
        schema: TodoPatch,
      },
    ],
    response: Todo,
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "post",
    path: "/list",
    alias: "createList",
    description: "Create new list",
    parameters: [
      {
        name: "todo",
        type: "Body",
        schema: CreateList,
      },
    ],
    response: List.omit({ todos: true }),
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "post",
    path: "/todo",
    alias: "createTodo",
    description: "Create new todo",
    parameters: [
      {
        name: "todo",
        type: "Body",
        schema: CreateTodo,
      },
    ],
    response: Todo,
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "delete",
    path: "/todo/:id",
    alias: "deleteTodo",
    description: "Delete todo",
    response: z.object({}),
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
]);

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
    <div className="relative overflow-y-auto overflow-x-hidden h-screen v-full bg-black">
      {page.mode == "home" && <HomePage setPageState={setPageState} />}
      {page.mode == "view-folder" && (
        <ViewFolderPage folderId={page.folderId} setPageState={setPageState} />
      )}
    </div>
  );
};

const HomePage = ({
  setPageState,
}: {
  setPageState: (newState: PageState) => void;
}) => {
  return (
    <div className="container mt-2 mx-auto">
      <CreateNewFolder />
      <div className="h-4"></div>
      <ViewFolders
        onFolderClick={(folderId) => {
          setPageState({ mode: "view-folder", folderId });
        }}
      />
    </div>
  );
};

type ViewFolderPageProps = {
  folderId: number;
  setPageState: (newState: PageState) => void;
};

const ViewFolderPage = ({ folderId, setPageState }: ViewFolderPageProps) => {
  const [isCreateTodoOpen, setCreateTodoOpen] = useState(false);
  const contentInputRef = useRef<HTMLInputElement>(null);

  const todos: Todo[] = new Array(20).fill(0).map((_, i) => {
    return { id: i, content: "Hello World", done: false, listId: 0 };
  });

  function closeCreateTodo() {
    setCreateTodoOpen(false);
  }

  function openCreateTodo() {
    setCreateTodoOpen(true);
  }

  function createNewTodo() {
    if (contentInputRef.current) {
      console.log("Value:", contentInputRef.current.value);
      closeCreateTodo();
    }
  }

  return (
    <div>
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
        {todos.map((item) => {
          return <TodoItem key={item.id} todo={item} />;
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
    </div>
  );
};

type TodoItemProps = {
  todo: Todo;
};

const TodoItem = ({ todo }: TodoItemProps) => {
  return (
    <div className="flex justify-between items-center bg-green-500 rounded py-2 px-2">
      <label className="flex items-center">
        <input
          className="w-5 h-5 rounded-full focus:ring-0 focus:ring-offset-0"
          type="checkbox"
        />
        <span className="ml-2">{todo.content}</span>
      </label>

      <Menu className="relative" as="div">
        <Menu.Button className="text-white flex h-full">
          <EllipsisHorizontalIcon className="w-8 h-8" />
        </Menu.Button>
        <Menu.Items
          className="flex flex-col gap-2 w-44 origin-top-left absolute right-0 z-50 bg-pink-400 px-1.5 py-1.5 rounded"
          as="div">
          <Menu.Item>
            {({ active }) => (
              <button
                className="w-full text-white flex items-center bg-sky-600 rounded px-2 py-1"
                onClick={() => console.log("Todo Delete")}>
                <TrashIcon className="w-6 h-6 text-red-400" />
                <span className="ml-1">Delete</span>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {/* <button className="" onClick={() => console.log("Open Menu")}> */}
      {/* <EllipsisHorizontalIcon className="w-6 h-6" /> */}
      {/* </button> */}
    </div>
  );
};

type ViewFoldersProps = {
  onFolderClick?: (folderId: number) => void;
};

const ViewFolders = ({ onFolderClick }: ViewFoldersProps) => {
  const arr = new Array(100).fill(0).map(() => {
    const num = Math.floor(Math.random() * 100);
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const data = new Array(num)
      .fill(0)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join("");

    return `Folder ${data}`;
  });

  return (
    <div className="flex flex-col gap-2">
      {arr.map((item, i) => {
        return (
          <FolderItem
            key={i}
            name={item}
            onClick={() => onFolderClick && onFolderClick(i)}
          />
        );
      })}
    </div>
  );
};

type FolderItemProps = {
  name: string;
  onClick?: () => void;
};

const FolderItem = ({ name, onClick }: FolderItemProps) => {
  // TODO(patrik): Remove truncation
  return (
    <button
      className="flex items-center justify-between rounded bg-blue-500"
      onClick={onClick}>
      <span className="text-left max-w-[75%] truncate text-lg ml-4">
        {name}
      </span>
      <ChevronRightIcon className="w-12 h-12" />
    </button>
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
//       api.updateTodo({ content: content }, { params: { id: props.id } }),
//     onSettled: () => client.invalidateQueries(["todo", props.id]),
//   });
//
//   const deleteTodo = useMutation({
//     mutationFn: () => api.deleteTodo(undefined, { params: { id: props.id } }),
//     onSettled: () => client.invalidateQueries(["lists"]),
//   });
//
//   if (error) return <p>Error: {JSON.stringify(error)}</p>;
//   if (!data) return <p>Loading...</p>;
//
//   return (
//     <div key={data.id} className="flex items-center">
//       <input
//         checked={data.done}
//         disabled={done.isLoading}
//         id={`todo-${data.id}`}
//         type="checkbox"
//         value=""
//         className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
//         onChange={() => {
//           done.mutate(!data.done);
//         }}
//       />
//       <label htmlFor={`todo-${data.id}`} className="">
//         {data.content}
//       </label>
//
//       <button
//         onClick={() => {
//           const newContent = prompt("New Content", data.content);
//           if (newContent) {
//             content.mutate(newContent);
//           }
//         }}>
//         <PencilIcon className="h-5 w-5 text-black" />
//       </button>
//
//       <button onClick={() => deleteTodo.mutate()}>
//         <TrashIcon className="h-6 w-6 text-black" />
//       </button>
//     </div>
//   );
// };

// const ListView = () => {
//   const { error, data } = useQuery({
//     queryKey: ["lists"],
//     queryFn: () => api.getAllLists(),
//   });
//
//   const createList = useMutation({
//     mutationFn: (list: CreateList) => api.createList(list),
//     onSettled: () => client.invalidateQueries(["lists"]),
//   });
//
//   const createTodo = useMutation({
//     mutationFn: (todo: CreateTodo) => api.createTodo(todo),
//     onSettled: () => client.invalidateQueries(["lists"]),
//   });
//
//   if (error) return <p>Error: {JSON.stringify(error)}</p>;
//   if (!data) return <p>Loading...</p>;
//
//   return (
//     <div>
//       <button
//         className="w-full bg-blue-400 rounded px-4 py-1"
//         onClick={() => {
//           const name = prompt("List name");
//           if (name) {
//             createList.mutate({ name });
//           }
//         }}>
//         Create new List
//       </button>
//
//       <button className="fixed bottom-4 right-4 bg-blue-600 rounded-full p-2">
//         <PlusIcon className="w-8 h-8" />
//       </button>
//
//       {data.map((item) => (
//         <div key={item.id}>
//           <Disclosure>
//             {({ open }) => (
//               <>
//                 <Disclosure.Button className="flex justify-between w-full bg-red-300">
//                   <span>{item.name}</span>
//                   <ChevronUpIcon
//                     className={`${
//                       open ? "" : "rotate-180 transform"
//                     } h-5 w-5 text-black`}
//                   />
//                 </Disclosure.Button>
//
//                 <Disclosure.Panel className="">
//                   <button
//                     className="bg-gray-400 rounded px-3 py-1"
//                     onClick={() => {
//                       const content = prompt("Todo");
//                       if (content) {
//                         createTodo.mutate({
//                           content: content,
//                           done: false,
//                           listId: item.id,
//                         });
//                       }
//                     }}>
//                     Create Todo
//                   </button>
//
//                   <button
//                     className="bg-gray-400 rounded px-3 py-1"
//                     onClick={() => {
//                       console.log("Haha");
//                     }}>
//                     Test
//                   </button>
//
//                   {item.todos.map((todo) => (
//                     <TodoItem key={todo.id} id={todo.id} />
//                   ))}
//                 </Disclosure.Panel>
//               </>
//             )}
//           </Disclosure>
//         </div>
//       ))}
//     </div>
//   );
// };

export default App;
