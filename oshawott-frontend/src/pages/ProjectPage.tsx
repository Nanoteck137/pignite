import {
  ArrowLeftIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ListItem,
  ListWithItems,
  getListWithItems,
  getProjectForPage,
} from "../api/api";
import { pb } from "../api/pocketbase";
import CreateModal from "../components/CreateModal";
import Dropdown from "../components/Dropdown";
import { Disclosure } from "@headlessui/react";
import NewConfirmModal from "../components/ConfirmModal";
import Button from "../components/Button";

interface ListItemProps {
  item: ListItem;
}

const ViewListItem = ({ item }: ListItemProps) => {
  const deleteModal = useRef<HTMLDialogElement>(null);

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
      className="flex items-center justify-between rounded bg-slate-600 p-2 elevation-4"
      key={item.id}>
      <label className="flex flex-grow items-center hover:cursor-pointer">
        <input
          checked={item.done}
          className="h-5 w-5 rounded-full text-blue-500 focus:ring-0 focus:ring-offset-0"
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
            icon: <PencilSquareIcon className="h-6 w-6" />,
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
            icon: <TrashIcon className="h-6 w-6" />,
            onClick: () =>
              deleteModal.current && deleteModal.current.showModal(),
          },
        ]}
      />

      <NewConfirmModal
        ref={deleteModal}
        title="Are you sure?"
        desc="You're about to delete the list!"
        cancel={() => {
          deleteModal.current && deleteModal.current.close();
        }}
        confirm={() => {
          deleteItem.mutate();
          deleteModal.current && deleteModal.current.close();
        }}
      />
    </div>
  );
};

interface ProjectListProps {
  projectId: string;
  listId: string;
}

const ProjectList = (props: ProjectListProps) => {
  const { projectId, listId } = props;

  const deleteModal = useRef<HTMLDialogElement>(null);

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
        className="rounded bg-slate-700 px-2 elevation-4"
        as="div"
        key={data.id}>
        {({ open }) => (
          <>
            <div className="flex items-center">
              <Disclosure.Button className="flex w-full items-center justify-between py-2">
                <div className="flex items-center">
                  <ChevronUpIcon
                    className={`h-6 w-6 text-white transition-transform duration-200 ${
                      open ? "" : "rotate-180"
                    }`}
                  />
                  <span className="text-white">{data.name}</span>
                </div>
              </Disclosure.Button>
            </div>

            <Disclosure.Panel className="flex flex-col gap-1 pb-2">
              <div className="flex gap-2">
                <Button
                  className="flex flex-grow items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    const name = prompt("New item name");
                    if (name) {
                      createListItem.mutate(name);
                    }
                  }}>
                  <PlusIcon className="h-8 w-8" />
                  <span>New Item</span>
                </Button>
                <Button varient="warning" varientStyle="outline">
                  <PencilSquareIcon className="h-6 w-6" />
                </Button>
                <Button
                  varient="danger"
                  varientStyle="outline"
                  onClick={() =>
                    deleteModal.current && deleteModal.current.showModal()
                  }>
                  <TrashIcon className="h-6 w-6" />
                </Button>
              </div>

              {data.items.map((item) => {
                return <ViewListItem key={item.id} item={item} />;
              })}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <NewConfirmModal
        ref={deleteModal}
        title="Are you sure?"
        desc="You're about to delete the list!"
        cancel={() => {
          deleteModal.current && deleteModal.current.close();
        }}
        confirm={() => {
          deleteModal.current && deleteModal.current.close();
          deleteList.mutate();
        }}
      />
    </>
  );
};

const ProjectPage = () => {
  const { id } = useParams();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const deleteModal = useRef<HTMLDialogElement>(null);

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
      <div className="h-14 bg-white elevation-6">
        <div className="container mx-auto flex h-full items-center justify-between bg-slate-700 px-4">
          <Link to="/">
            <ArrowLeftIcon className="h-8 w-8 text-white" />
          </Link>

          <p className="truncate px-4 text-lg text-white">
            {data.project.name}
          </p>

          <Dropdown
            iconSize="8"
            items={[
              {
                name: "New List",
                icon: <PlusIcon className="h-6 w-6" />,
                onClick: () => setCreateModalOpen(true),
              },
              {
                name: "Edit Project",
                icon: <PencilSquareIcon className="h-6 w-6" />,
              },
              {
                name: "Delete Project",
                type: "red",
                icon: <TrashIcon className="h-6 w-6" />,
                onClick: () =>
                  deleteModal.current && deleteModal.current.showModal(),
              },
            ]}
          />
        </div>
      </div>

      <div className="h-10"></div>

      <div className="container mx-auto flex flex-col gap-2 px-2">
        {data.lists.map((list) => {
          return (
            <ProjectList key={list} projectId={data.project.id} listId={list} />
          );
        })}
      </div>

      <NewConfirmModal
        ref={deleteModal}
        title="Are you sure?"
        desc="You are about to delete the project!"
        cancel={() => {
          deleteModal.current && deleteModal.current.close();
        }}
        confirm={() => {
          deleteProject.mutate();
          deleteModal.current && deleteModal.current.close();
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
