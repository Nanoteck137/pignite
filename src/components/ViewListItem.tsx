import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListItem, ListWithItems } from "../api/api";
import { pb } from "../api/pocketbase";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import Dropdown from "./Dropdown";

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
    onSettled: () => client.invalidateQueries(["list", item.list]),
  });

  const editItemName = useMutation({
    mutationFn: (name: string) =>
      pb.collection("list_items").update(item.id, { name }),
    onSettled: () => client.invalidateQueries(["list", item.list]),
  });

  const deleteItem = useMutation({
    mutationFn: () => pb.collection("list_items").delete(item.id),
    onSettled: () => client.invalidateQueries(["list", item.list]),
  });

  return (
    <div
      className="flex justify-between items-center rounded bg-slate-600 p-2 elevation-4"
      key={item.id}>
      <label className="flex items-center flex-grow hover:cursor-pointer">
        <input
          checked={item.done}
          className="w-5 h-5 rounded-full text-pink-500 focus:ring-0 focus:ring-offset-0"
          type="checkbox"
          onChange={() => markItem.mutate(!item.done)}
        />
        <div className="w-1"></div>
        <span className="text-white">{item.name}</span>
      </label>

      <Dropdown
        items={[
          {
            name: "Test",
            icon: <PencilSquareIcon className="w-6 h-6" />,
            onClick: () => {
              const name = prompt("New name");
              if (name) {
                editItemName.mutate(name);
              }
            },
          },
          {
            name: "Delete",
            type: "red",
            icon: <TrashIcon className="w-6 h-6" />,
            onClick: () => deleteItem.mutate(),
          },
        ]}
      />

      {/* <Menu className="relative" as="div"> */}
      {/*   <Menu.Button className="flex items-center" as="div"> */}
      {/*     <EllipsisVerticalIcon className="w-6 h-6 text-white" /> */}
      {/*   </Menu.Button> */}
      {/*   <Menu.Items className="flex flex-col gap-2 absolute right-1 min-w-max z-50 rounded bg-slate-500 elevation-4 p-2"> */}
      {/*     <Menu.Item> */}
      {/*       <div className="flex px-2 py-1 rounded bg-purple-400 text-white"> */}
      {/*         <PencilSquareIcon className="w-6 h-6" /> */}
      {/*         <button className="flex-grow">Edit</button> */}
      {/*       </div> */}
      {/*     </Menu.Item> */}
      {/*     <Menu.Item> */}
      {/*       <div className="flex px-2 py-1 rounded bg-red-400 text-white"> */}
      {/*         <TrashIcon className="w-6 h-6" /> */}
      {/*         <div className="w-2"></div> */}
      {/*         <button className="">Delete</button> */}
      {/*       </div> */}
      {/*     </Menu.Item> */}
      {/*   </Menu.Items> */}
      {/* </Menu> */}
    </div>
  );
};

export default ViewListItem;
