import { Disclosure } from "@headlessui/react";
import {
  ChevronUpIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import ViewListItem from "./ViewListItem";
import { getListWithItems } from "../api/api";
import { pb } from "../api/pocketbase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ProjectListProps {
  projectId: string;
  listId: string;
}

const ProjectList = (props: ProjectListProps) => {
  const { projectId, listId } = props;

  const client = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["list", listId],
    queryFn: () => getListWithItems(listId),
  });

  const createListItem = useMutation({
    mutationFn: (name: string) =>
      pb.collection("list_items").create({ name, list: listId }),
    onSettled: () => client.invalidateQueries(["list", listId]),
  });

  const deleteList = useMutation({
    mutationFn: () => pb.collection("lists").delete(listId),
    onSettled: () => client.invalidateQueries(["project", projectId]),
  });

  if (isError) return <p className="text-white">Error</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <Disclosure
      className="rounded elevation-4 bg-slate-700 px-2"
      as="div"
      key={data.id}>
      {({ open }) => (
        <>
          <div className="flex items-center">
            <Disclosure.Button className="flex justify-between items-center w-full py-2">
              <div className="flex items-center">
                <ChevronUpIcon
                  className={`w-6 h-6 text-white transition-transform duration-200 ${
                    open ? "" : "rotate-180"
                  }`}
                />
                <span className="text-white">{data.name}</span>
              </div>
            </Disclosure.Button>
          </div>

          <Disclosure.Panel className="flex flex-col gap-1 pb-2">
            <div className="flex gap-2">
              <button
                className="flex items-center flex-grow bg-purple-500 rounded py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  const name = prompt("New item name");
                  if (name) {
                    createListItem.mutate(name);
                  }
                }}>
                <PlusIcon className="w-8 h-8 text-white" />
                <span className="text-white">New Item</span>
              </button>
              <button className="bg-yellow-500 rounded px-2">
                <PencilSquareIcon className="w-6 h-6" />
              </button>
              <button
                className="bg-red-500 rounded px-2"
                onClick={() => deleteList.mutate()}>
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>

            {data.items.map((item) => {
              return <ViewListItem key={item.id} item={item} />;
            })}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default ProjectList;
