import { Menu } from "@headlessui/react";
import { EllipsisHorizontalIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Todo } from "../interfaces/todo";

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
    </div>
  );
};

export default TodoItem;
