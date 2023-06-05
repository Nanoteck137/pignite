import {
  HomeIcon,
  PlusIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/api";
import { pb } from "../api/pocketbase";
import CreateModal from "../components/CreateModal";

const HomePage = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const client = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const createProject = useMutation({
    mutationFn: (name: string) =>
      pb.collection("projects").create({ name, color: "#ff00ff" }),
    onSettled: () => client.invalidateQueries(["projects"]),
  });

  if (isError) return <p className="text-white">Error</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0" }}
      exit={{ x: "-100%" }}>
      <div className="h-14 bg-white elevation-6">
        <div className="container mx-auto flex h-full items-center justify-between bg-slate-700 px-4">
          <Link to="/">
            <HomeIcon className="h-8 w-8 text-white" />
          </Link>
          <button
            onClick={() => {
              setCreateModalOpen(true);
            }}>
            <PlusIcon className="h-10 w-10 text-white" />
          </button>
        </div>
      </div>

      <div className="h-10"></div>

      <div className="container mx-auto flex flex-col gap-2 px-4">
        {data.map((item) => {
          return (
            <Link
              className="flex items-center justify-between rounded bg-purple-500 p-2 elevation-4 hover:bg-purple-400"
              to={`/project/${item.id}`}
              key={item.id}>
              <span className="ml-2 flex-grow text-left text-lg text-white">
                {item.name}
              </span>
              <ChevronRightIcon className="h-12 min-w-[3rem] text-white" />
            </Link>
          );
        })}
      </div>

      <CreateModal
        title="New Project"
        open={isCreateModalOpen}
        close={() => setCreateModalOpen(false)}
        create={(name) => createProject.mutate(name)}
      />
    </motion.div>
  );
};

export default HomePage;