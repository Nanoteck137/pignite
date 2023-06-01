import {
  ArrowLeftIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProjectForPage } from "../api/api";
import { pb } from "../api/pocketbase";
import ConfirmModal from "../components/ConfirmModal";
import CreateModal from "../components/CreateModal";
import Dropdown from "../components/Dropdown";
import ProjectList from "../components/ProjectList";

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
