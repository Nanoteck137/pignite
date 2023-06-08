import {
  ChevronRightIcon,
  HomeIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { handleModalOutsideClick } from "../utils/modal";
import Button from "../components/Button";
import Input from "../components/Input";

const HomePage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createModal = useRef<HTMLDialogElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  const { data, isError, isLoading } = trpc.project.getAll.useQuery();

  const createProject = trpc.project.create.useMutation({
    onSettled: () => {
      const queryKey = getQueryKey(trpc.project.getAll);
      queryClient.invalidateQueries(queryKey);
    },
  });

  if (isError) return <p className="text-white">Error</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0" }}
      exit={{ x: "-100%" }}
    >
      <div className="h-14 bg-white elevation-6">
        <div className="container mx-auto flex h-full items-center justify-between bg-slate-700 px-4">
          <Button
            varient="secondary"
            varientStyle="text"
            className="px-1 py-1"
            onClick={() => navigate("/")}
          >
            <HomeIcon className="h-8 w-8 text-white" />
          </Button>
          <Button
            varient="secondary"
            varientStyle="text"
            className="px-0 py-0"
            onClick={() => {
              createModal.current && createModal.current.showModal();
            }}
          >
            <PlusIcon className="h-10 w-10 text-white" />
          </Button>
        </div>
      </div>

      <div className="h-10" />

      <div className="container mx-auto flex flex-col gap-2 px-4">
        {data.map((item) => {
          return (
            <Link
              className="flex items-center justify-between rounded bg-purple-500 p-2 elevation-4 hover:bg-purple-400"
              to={`/project/${item.id}`}
              key={item.id}
            >
              <span className="ml-2 flex-grow text-left text-lg text-white">
                {item.name}
              </span>
              <ChevronRightIcon className="h-12 min-w-[3rem] text-white" />
            </Link>
          );
        })}
      </div>

      <dialog
        className="w-full max-w-sm rounded bg-slate-700 px-4 py-4"
        ref={createModal}
        onClick={handleModalOutsideClick}
      >
        <h1 className="text-2xl text-white">Create new Project</h1>
        <div className="h-4" />
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (nameInput.current) {
              const name = nameInput.current.value;
              createProject.mutate({ name, color: "#ff00ff" });
              // TODO(patrik): Should we do this when the mutation succeeded
              nameInput.current.value = "";
            }
            createModal.current && createModal.current.close();
          }}
        >
          <Input ref={nameInput} type="text" placeholder="Name" />

          <div className="h-4" />
          <div className="flex justify-end">
            <Button
              varient="secondary"
              varientStyle="text"
              onClick={() => {
                createModal.current && createModal.current.close();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </dialog>
    </motion.div>
  );
};

export default HomePage;
