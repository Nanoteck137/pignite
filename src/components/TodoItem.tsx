import { Menu } from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Todo, TodoPatch } from "../interfaces/todo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodo } from "../api/fetch";
import api from "../api/api";

type TodoItemProps = {
  id: number;
};

function useTodo(id: number) {
  return useQuery({
    queryKey: ["todos", id],
    queryFn: () => fetchTodo(id),
  });
}

const TodoItem = ({ id }: TodoItemProps) => {
  const client = useQueryClient();
  const { data, isError, isLoading } = useTodo(id);

  const editTodo = useMutation({
    mutationFn: (data: TodoPatch) => {
      return api.updateTodo(data, { params: { id } });
    },

    onMutate: async (data) => {
      await client.cancelQueries({ queryKey: ["todos", id] });
      const previousTodo = client.getQueryData<Todo>(["todos", id]);

      const newTodo = {
        ...previousTodo,
        done: data.done,
        content: data.content || previousTodo?.content,
      };
      client.setQueryData(["todos", id], newTodo);
      return { previousTodo, newTodo };
    },

    onError: (_err, _newTodo, context) => {
      if (context) {
        client.setQueryData(["todos", id], context.previousTodo);
      }
    },

    onSettled: () => {
      client.invalidateQueries({ queryKey: ["todos", id] });
    },
  });

  if (isError) return <p>Error</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex justify-between items-center bg-green-500 rounded py-2 px-2">
      <label className="flex items-center">
        <input
          checked={data.done}
          className="w-5 h-5 rounded-full focus:ring-0 focus:ring-offset-0"
          type="checkbox"
          onChange={() => {
            editTodo.mutate({ done: !data.done });
          }}
        />
        <span className="ml-2">{data.content}</span>
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
                onClick={() => console.log("Todo Edit")}>
                <PencilSquareIcon className="w-6 h-6 text-red-400" />
                <span className="ml-1">Edit</span>
              </button>
            )}
          </Menu.Item>
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
    </div>
  );
};

export default TodoItem;
