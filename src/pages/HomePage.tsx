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
      <div className="bg-white h-14 elevation-6">
        <div className="h-full flex justify-between items-center container mx-auto bg-slate-700 px-4">
          <Link to="/">
            <HomeIcon className="w-8 h-8 text-white" />
          </Link>
          <button
            onClick={() => {
              setCreateModalOpen(true);
            }}>
            <PlusIcon className="w-10 h-10 text-white" />
          </button>
        </div>
      </div>

      <div className="h-10"></div>

      <div className="flex flex-col gap-2 container mx-auto px-4">
        {data.map((item) => {
          return (
            <Link
              className="flex items-center justify-between rounded bg-purple-500 hover:bg-purple-400 elevation-4 p-2"
              to={`/project/${item.id}`}
              key={item.id}>
              <span className="flex-grow text-left text-lg text-white ml-2">
                {item.name}
              </span>
              <ChevronRightIcon className="min-w-[3rem] h-12 text-white" />
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
