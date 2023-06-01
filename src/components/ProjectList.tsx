import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, PlusIcon } from "@heroicons/react/20/solid";
import ViewListItem from "./ViewListItem";
import { getListWithItems } from "../api/api";
import { pb } from "../api/pocketbase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ProjectListProps {
  listId: string;
}

const ProjectList = ({ listId }: ProjectListProps) => {
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

  if (isError) return <p className="text-white">Error</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <Disclosure className="bg-blue-500 rounded" as="div" key={data.id}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center w-full py-2 px-2">
            <ChevronUpIcon
              className={`w-6 h-6 text-white transition-transform duration-200 ${
                open ? "" : "rotate-180"
              }`}
            />
            <span className="text-white">{data.name}</span>
          </Disclosure.Button>
          <Disclosure.Panel className="flex flex-col gap-1 pb-2">
            <button
              className="flex items-center bg-green-400 rounded mx-2"
              onClick={(e) => {
                e.stopPropagation();
                const name = prompt("New item name");
                if (name) {
                  createListItem.mutate(name);
                }
              }}>
              <PlusIcon className="w-8 h-8" />
              <span>New Item</span>
            </button>

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
