import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListItem, ListWithItems } from "../api/api";
import { pb } from "../api/pocketbase";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

interface ListItemProps {
  item: ListItem;
}

const ViewListItem = ({ item }: ListItemProps) => {
  const client = useQueryClient();
  const markItem = useMutation({
    mutationFn: (done: boolean) =>
      pb.collection("list_items").update(item.id, { done }),
    onMutate: async (done) => {
      await client.cancelQueries(["list", item.list]);

      const oldData = client.getQueryData<ListWithItems>(["list", item.list]);
      client.setQueryData<ListWithItems>(["list", item.list], (old) => {
        if (old) {
          const oldItem = old.items.find((oldItem) => oldItem.id === item.id);
          if (oldItem) {
            oldItem.done = done;
          }
        }
        return old;
      });
      return { oldData };
    },
    onError: (err, done, context) => {
      client.setQueryData(["list", item.list], context?.oldData);
    },
    onSettled: () => {
      client.invalidateQueries(["list", item.list]);
    },
  });

  return (
    <div
      className="flex justify-between items-center rounded bg-pink-400 p-2 mx-2"
      key={item.id}>
      <label className="flex items-center">
        <input
          checked={item.done}
          className="w-5 h-5 rounded-full focus:ring-0 focus:ring-offset-0"
          type="checkbox"
          onChange={() => markItem.mutate(!item.done)}
        />
        <span className="ml-1">{item.name}</span>
      </label>

      <Menu className="relative" as="div">
        <Menu.Button className="flex items-center" as="div">
          <EllipsisVerticalIcon className="w-6 h-6" />
        </Menu.Button>
        <Menu.Items className="flex flex-col gap-2 absolute right-1 w-36 z-50 rounded bg-pink-100 p-2">
          <Menu.Item>
            <button className="px-2 py-1 rounded bg-green-300 hover:bg-green-200">
              Edit
            </button>
          </Menu.Item>
          <Menu.Item>
            <button className="px-2 py-1 rounded bg-green-300 hover:bg-green-200">
              Delete
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default ViewListItem;
