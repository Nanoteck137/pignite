import { Disclosure } from "@headlessui/react";
import {
  ChevronUpIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Zodios } from "@zodios/core";
import { z } from "zod";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

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
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/list/:id" element={<Test />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const Wot = z.object({
  id: z.preprocess((val) => parseInt(val as string), z.number()),
});

const Test = () => {
  const rawParams = useParams();
  const params = Wot.parse(rawParams);

  const { error, data } = useQuery({
    queryKey: ["list", params.id],
    queryFn: () => api.getList({ params: { id: params.id } }),
  });

  const createTodo = useMutation({
    mutationFn: (todo: CreateTodo) => api.createTodo(todo),
    onSettled: () => client.invalidateQueries(["list", params.id]),
  });

  if (error) return <p>Error: {JSON.stringify(error)}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <>
      <p>Name: {data.name}</p>
      <button
        className="bg-blue-400 rounded px-2 py-1"
        onClick={() => {
          const content = prompt("New todo");
          if (content) {
            createTodo.mutate({
              content: content,
              done: false,
              listId: params.id,
            });
          }
        }}>
        Create Todo
      </button>
      {data.todos.map((todo) => (
        <TodoItem key={todo.id} id={todo.id} />
      ))}
    </>
  );
};

// <ListView />
// <ReactQueryDevtools />

const TodoItem = (props: { id: number }) => {
  const { error, data } = useQuery({
    queryKey: ["todo", props.id],
    queryFn: () => api.getTodo({ params: { id: props.id } }),
  });

  const done = useMutation({
    mutationFn: (done: boolean) =>
      api.updateTodo({ done: done }, { params: { id: props.id } }),
    onSettled: () => client.invalidateQueries(["todo", props.id]),
  });

  const content = useMutation({
    mutationFn: (content: string) =>
      api.updateTodo({ content: content }, { params: { id: props.id } }),
    onSettled: () => client.invalidateQueries(["todo", props.id]),
  });

  const deleteTodo = useMutation({
    mutationFn: () => api.deleteTodo(undefined, { params: { id: props.id } }),
    onSettled: () => client.invalidateQueries(["lists"]),
  });

  if (error) return <p>Error: {JSON.stringify(error)}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div key={data.id} className="flex items-center">
      <input
        checked={data.done}
        disabled={done.isLoading}
        id={`todo-${data.id}`}
        type="checkbox"
        value=""
        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
        onChange={() => {
          done.mutate(!data.done);
        }}
      />
      <label htmlFor={`todo-${data.id}`} className="">
        {data.content}
      </label>

      <button
        onClick={() => {
          const newContent = prompt("New Content", data.content);
          if (newContent) {
            content.mutate(newContent);
          }
        }}>
        <PencilIcon className="h-5 w-5 text-black" />
      </button>

      <button onClick={() => deleteTodo.mutate()}>
        <TrashIcon className="h-6 w-6 text-black" />
      </button>
    </div>
  );
};

const ListView = () => {
  const { error, data } = useQuery({
    queryKey: ["lists"],
    queryFn: () => api.getAllLists(),
  });

  const createList = useMutation({
    mutationFn: (list: CreateList) => api.createList(list),
    onSettled: () => client.invalidateQueries(["lists"]),
  });

  const createTodo = useMutation({
    mutationFn: (todo: CreateTodo) => api.createTodo(todo),
    onSettled: () => client.invalidateQueries(["lists"]),
  });

  if (error) return <p>Error: {JSON.stringify(error)}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <button
        className="w-full bg-blue-400 rounded px-4 py-1"
        onClick={() => {
          const name = prompt("List name");
          if (name) {
            createList.mutate({ name });
          }
        }}>
        Create new List
      </button>

      <button className="fixed bottom-4 right-4 bg-blue-600 rounded-full p-2">
        <PlusIcon className="w-8 h-8" />
      </button>

      {data.map((item) => (
        <div key={item.id}>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full bg-red-300">
                  <span>{item.name}</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "" : "rotate-180 transform"
                    } h-5 w-5 text-black`}
                  />
                </Disclosure.Button>

                <Disclosure.Panel className="">
                  <button
                    className="bg-gray-400 rounded px-3 py-1"
                    onClick={() => {
                      const content = prompt("Todo");
                      if (content) {
                        createTodo.mutate({
                          content: content,
                          done: false,
                          listId: item.id,
                        });
                      }
                    }}>
                    Create Todo
                  </button>

                  {item.todos.map((todo) => (
                    <TodoItem key={todo.id} id={todo.id} />
                  ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  );
};

export default App;
