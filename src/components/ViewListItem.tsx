import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListItem, ListWithItems } from "../api/api";
import { pb } from "../api/pocketbase";

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
    <div className="bg-pink-400 py-2 mx-2 rounded" key={item.id}>
      <label className="flex items-center ml-2">
        <input
          checked={item.done}
          className="w-5 h-5 rounded-full focus:ring-0 focus:ring-offset-0"
          type="checkbox"
          onChange={() => markItem.mutate(!item.done)}
        />
        <span className="ml-1">{item.name}</span>
      </label>
    </div>
  );
};

export default ViewListItem;
