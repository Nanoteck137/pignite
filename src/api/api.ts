import { z } from "zod";
import { pb } from "./pocketbase";

const BaseModel = z.object({
  id: z.string(),
  created: z.string(),
  updated: z.string(),
});
type BaseModel = z.infer<typeof BaseModel>;

const Record = BaseModel.merge(
  z.object({
    collectionId: z.string(),
    collectionName: z.string(),
  }),
);
type Record = z.infer<typeof Record>;

const Project = Record.merge(
  z.object({
    name: z.string(),
    color: z.string(),
  }),
);
type Project = z.infer<typeof Project>;

const Projects = z.array(Project);
type Projects = z.infer<typeof Projects>;

const List = Record.merge(
  z.object({
    name: z.string(),
  }),
);
type List = z.infer<typeof List>;

export async function getProjects() {
  const data = await pb.collection("projects").getFullList();
  return await Projects.parseAsync(data);
}

export async function getProjectById(projectId: string) {
  const data = await pb.collection("projects").getOne(projectId);
  return await Project.parseAsync(data);
}

export async function getProjectLists(projectId: string) {
  const data = await pb
    .collection("lists")
    .getFullList({ filter: `project="${projectId}"` });
  return await z.array(List).parseAsync(data);
}
