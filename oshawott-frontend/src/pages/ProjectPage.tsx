import { Disclosure } from "@headlessui/react";
import {
  ArrowLeftIcon,
  ChevronUpIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import NewConfirmModal from "../components/ConfirmModal";
import CreateModal from "../components/CreateModal";
import Dropdown from "../components/Dropdown";
import { RouterOutputs, trpc } from "../trpc";
import { handleModalOutsideClick } from "../utils/modal";
import Input from "../components/Input";

type ListItem = RouterOutputs["project"]["list"]["getList"]["items"][number];

interface ListItemProps {
  item: ListItem;
}

const ViewListItem = ({ item }: ListItemProps) => {
  const queryClient = useQueryClient();

  const deleteModal = useRef<HTMLDialogElement>(null);
  const editModal = useRef<HTMLDialogElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  const editItem = trpc.project.list.editItem.useMutation({
    onSettled: () => {
      const queryKey = getQueryKey(trpc.project.list.getList, {
        id: item.listId,
      });
      queryClient.invalidateQueries(queryKey);
    },
  });

  const deleteItem = trpc.project.list.deleteItem.useMutation({
    onSettled: () => {
      const queryKey = getQueryKey(trpc.project.list.getList, {
        id: item.listId,
      });
      queryClient.invalidateQueries(queryKey);
    },
  });

  return (
    <div
      className="flex items-center justify-between rounded bg-slate-600 p-2 elevation-4"
      key={item.id}
    >
      <label className="flex flex-grow items-center hover:cursor-pointer">
        <input
          checked={item.done}
          className="h-5 w-5 rounded-full text-blue-500 focus:ring-0 focus:ring-offset-0"
          type="checkbox"
          onChange={() =>
            editItem.mutate({ id: item.id, data: { done: !item.done } })
          }
        />
        <div className="w-1"></div>
        <span className="text-white">{item.name}</span>
      </label>

      <Dropdown
        items={[
          {
            name: "Test",
            icon: <PencilSquareIcon className="h-6 w-6" />,
            onClick: () => editModal.current && editModal.current.showModal(),
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

      <dialog
        className="w-full max-w-sm rounded bg-slate-700 px-4 py-4"
        ref={editModal}
        onClick={handleModalOutsideClick}
      >
        <h1 className="text-2xl text-white">Edit Item</h1>
        <div className="h-4"></div>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (nameInput.current) {
              const name = nameInput.current.value;
              editItem.mutate({ id: item.id, data: { name } });

              editModal.current && editModal.current.close();
            }
          }}
        >
          <Input
            ref={nameInput}
            label="New Name"
            type="text"
            defaultValue={item.name}
          />

          <div className="h-4"></div>
          <div className="flex justify-end gap-2">
            <Button
              varient="secondary"
              varientStyle="text"
              type="button"
              onClick={() => {
                editModal.current && editModal.current.close();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </dialog>

      <NewConfirmModal
        ref={deleteModal}
        title="Are you sure?"
        desc="You're about to delete the list!"
        cancel={() => {
          deleteModal.current && deleteModal.current.close();
        }}
        confirm={() => {
          deleteItem.mutate({ id: item.id });
          deleteModal.current && deleteModal.current.close();
        }}
      />
    </div>
  );
};

interface ProjectListProps {
  listId: string;
}

const ProjectList = (props: ProjectListProps) => {
  const { listId } = props;

  const queryClient = useQueryClient();

  const deleteModal = useRef<HTMLDialogElement>(null);
  const editModal = useRef<HTMLDialogElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  const { data, isError, isLoading } = trpc.project.list.getList.useQuery({
    id: listId,
  });

  const newItem = trpc.project.list.createItem.useMutation({
    onSettled: () => {
      const queryKey = getQueryKey(trpc.project.list.getList, { id: listId });
      queryClient.invalidateQueries(queryKey);
    },
  });

  const deleteList = trpc.project.list.delete.useMutation({
    onSettled: () => {
      if (data) {
        const queryKey = getQueryKey(trpc.project.get, { id: data.projectId });
        queryClient.invalidateQueries(queryKey);
      }
    },
  });

  const editList = trpc.project.list.edit.useMutation({
    onSettled: () => {
      if (data) {
        const queryKey = getQueryKey(trpc.project.list.getList, {
          id: data.id,
        });
        queryClient.invalidateQueries(queryKey);
      }
    },
  });

  if (isError) return <p className="text-white">Error</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <>
      <Disclosure
        className="rounded bg-slate-700 px-2 elevation-4"
        as="div"
        key={data.id}
      >
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
                      newItem.mutate({ name, listId: data.id });
                      // createListItem.mutate(name);
                    }
                  }}
                >
                  <PlusIcon className="h-8 w-8" />
                  <span>New Item</span>
                </Button>
                <Button
                  varient="warning"
                  varientStyle="outline"
                  onClick={() => {
                    editModal.current && editModal.current.showModal();
                  }}
                >
                  <PencilSquareIcon className="h-6 w-6" />
                </Button>
                <Button
                  varient="danger"
                  varientStyle="outline"
                  onClick={() =>
                    deleteModal.current && deleteModal.current.showModal()
                  }
                >
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

      <dialog
        className="w-full max-w-sm rounded bg-slate-700 px-4 py-4"
        ref={editModal}
        onClick={handleModalOutsideClick}
      >
        <h1 className="text-2xl text-white">Edit List</h1>
        <div className="h-4"></div>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (nameInput.current) {
              const name = nameInput.current.value;
              editList.mutate({ id: data.id, data: { name } });

              editModal.current && editModal.current.close();
            }
          }}
        >
          <Input
            ref={nameInput}
            label="New Name"
            type="text"
            defaultValue={data.name}
          />

          <div className="h-4"></div>
          <div className="flex justify-end gap-2">
            <Button
              varient="secondary"
              varientStyle="text"
              type="button"
              onClick={() => {
                editModal.current && editModal.current.close();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </dialog>

      <NewConfirmModal
        ref={deleteModal}
        title="Are you sure?"
        desc="You're about to delete the list!"
        cancel={() => {
          deleteModal.current && deleteModal.current.close();
        }}
        confirm={() => {
          deleteList.mutate({ id: data.id });
          deleteModal.current && deleteModal.current.close();
        }}
      />
    </>
  );
};

const ProjectPage = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteModal = useRef<HTMLDialogElement>(null);
  const editModal = useRef<HTMLDialogElement>(null);
  const editInput = useRef<HTMLInputElement>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const { data, isError, isLoading } = trpc.project.get.useQuery(
    { id: id ?? "" },
    { enabled: !!id },
  );

  const createList = trpc.project.list.create.useMutation({
    onSettled: () => {
      if (data) {
        const queryKey = getQueryKey(trpc.project.get, { id: data.id });
        queryClient.invalidateQueries(queryKey);
      }
    },
  });

  const deleteProject = trpc.project.delete.useMutation({
    onSuccess: () => navigate("/"),
    onSettled: () => {
      const queryKey = getQueryKey(trpc.project.getAll);
      queryClient.invalidateQueries(queryKey);
    },
  });

  const editProject = trpc.project.edit.useMutation({
    onSettled: () => {
      if (data) {
        const queryKey = getQueryKey(trpc.project.get, { id: data.id });
        queryClient.invalidateQueries(queryKey);
      }
    },
  });

  if (isError) return <p className="text-white">Error</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <motion.div
      className="w-full"
      initial={{ x: "-100%" }}
      animate={{ x: "0" }}
      exit={{ x: "-100%" }}
    >
      <div className="h-14 bg-white elevation-6">
        <div className="container mx-auto flex h-full items-center justify-between bg-slate-700 px-4">
          <Link to="/">
            <ArrowLeftIcon className="h-8 w-8 text-white" />
          </Link>

          <p className="truncate px-4 text-lg text-white">{data.name}</p>

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
                onClick: () =>
                  editModal.current && editModal.current.showModal(),
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
          return <ProjectList key={list.id} listId={list.id} />;
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
          deleteProject.mutate({ id: data.id });
          deleteModal.current && deleteModal.current.close();
        }}
      />

      <dialog
        className="w-full max-w-sm rounded bg-slate-700 px-4 py-4"
        ref={editModal}
        onClick={handleModalOutsideClick}
      >
        <h1 className="text-2xl text-white">Edit Project</h1>
        <div className="h-4"></div>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (editInput.current) {
              const name = editInput.current.value;
              editProject.mutate({ id: data.id, data: { name } });

              editModal.current && editModal.current.close();
            }
          }}
        >
          <Input label="New Name" type="text" defaultValue={data.name} />

          <div className="h-4"></div>
          <div className="flex justify-end gap-2">
            <Button
              varient="secondary"
              varientStyle="text"
              type="button"
              onClick={() => {
                editModal.current && editModal.current.close();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </dialog>

      <CreateModal
        title="New List"
        open={isCreateModalOpen}
        close={() => setCreateModalOpen(false)}
        create={(name) => createList.mutate({ name, projectId: data.id })}
      />
    </motion.div>
  );
};

export default ProjectPage;
