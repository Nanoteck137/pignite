import {
  ArrowLeftIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ListItem,
  ListWithItems,
  getListWithItems,
  getProjectForPage,
} from "../api/api";
import { pb } from "../api/pocketbase";
import ConfirmModal from "../components/ConfirmModal";
import CreateModal from "../components/CreateModal";
import Dropdown from "../components/Dropdown";
import { Disclosure } from "@headlessui/react";

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
    onError: (_err, _done, context) => {
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

interface ProjectListProps {
  projectId: string;
  listId: string;
}

const ProjectList = (props: ProjectListProps) => {
  const { projectId, listId } = props;

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

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
    <>
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
                  onClick={() => setDeleteModalOpen(true)}>
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

      <ConfirmModal
        open={isDeleteModalOpen}
        title="Are you sure?"
        desc="You're about to delete the list!"
        cancel={() => setDeleteModalOpen(false)}
        confirm={() => deleteList.mutate()}
      />
    </>
  );
};

const ProjectPage = () => {
  const { id } = useParams();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const client = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectForPage(id || ""),
    enabled: !!id,
  });

  const createList = useMutation({
    mutationFn: (name: string) =>
      pb.collection("lists").create({ name, project: id }),
    onSettled: () => client.invalidateQueries(["project", id]),
  });

  const deleteProject = useMutation({
    mutationFn: () => pb.collection("projects").delete(id || ""),
    onSuccess: () => navigate("/"),
    onSettled: () => client.invalidateQueries(["projects"]),
  });

  if (isError) return <p className="text-white">Error</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <motion.div
      className="w-full"
      initial={{ x: "-100%" }}
      animate={{ x: "0" }}
      exit={{ x: "-100%" }}>
      <div className="bg-white h-14 elevation-6">
        <div className="h-full flex justify-between items-center container mx-auto bg-slate-700 px-4">
          <Link to="/">
            <ArrowLeftIcon className="w-8 h-8 text-white" />
          </Link>

          <p className="truncate text-white text-lg px-4">
            {data.project.name}
          </p>

          <Dropdown
            iconSize="8"
            items={[
              {
                name: "New List",
                icon: <PlusIcon className="w-6 h-6" />,
                onClick: () => setCreateModalOpen(true),
              },
              {
                name: "Edit Project",
                icon: <PencilSquareIcon className="w-6 h-6" />,
              },
              {
                name: "Delete Project",
                type: "red",
                icon: <TrashIcon className="w-6 h-6" />,
                onClick: () => setConfirmDeleteModalOpen(true),
              },
            ]}
          />
        </div>
      </div>

      <div className="h-10"></div>

      <div className="flex flex-col gap-2 container mx-auto px-2">
        {data.lists.map((list) => {
          return (
            <ProjectList key={list} projectId={data.project.id} listId={list} />
          );
        })}
      </div>

      <ConfirmModal
        open={isConfirmDeleteModalOpen}
        title="Are you sure?"
        desc="You are about to delete the project!"
        cancelTitle="Cancel"
        confirmTitle="Delete"
        cancel={() => setConfirmDeleteModalOpen(false)}
        confirm={() => {
          deleteProject.mutate();
          setConfirmDeleteModalOpen(false);
        }}
      />

      <CreateModal
        title="New List"
        open={isCreateModalOpen}
        close={() => setCreateModalOpen(false)}
        create={(name) => createList.mutate(name)}
      />
    </motion.div>
  );
};

export default ProjectPage;
