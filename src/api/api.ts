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

export const ListItem = Record.merge(
  z.object({
    name: z.string(),
    content: z.string(),
    done: z.boolean(),

    list: z.string(),
  }),
);
export type ListItem = z.infer<typeof ListItem>;

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

export async function getProjectListsId(projectId: string) {
  const data = await pb
    .collection("lists")
    .getFullList({ filter: `project="${projectId}"`, fields: "id" });
  return await z.array(z.object({ id: z.string() })).parseAsync(data);
}

export async function getListItems(listId: string) {
  const data = await pb
    .collection("list_items")
    .getFullList({ filter: `list="${listId}"` });
  return await z.array(ListItem).parseAsync(data);
}

export async function getList(listId: string) {
  const list = await pb.collection("lists").getOne(listId);
  return await List.parseAsync(list);
}

export async function getListWithItems(listId: string): Promise<ListWithItems> {
  const list = await getList(listId);
  const items = await getListItems(list.id);
  return {
    ...list,
    items,
  };
}

export const ListWithItems = List.merge(
  z.object({
    items: z.array(ListItem),
  }),
);
export type ListWithItems = z.infer<typeof ListWithItems>;

const FullProject = Project.merge(
  z.object({
    lists: z.array(ListWithItems),
  }),
);
type FullProject = z.infer<typeof FullProject>;

interface Test {
  project: Project;
  lists: string[];
}

export async function getProjectForPage(projectId: string): Promise<Test> {
  const project = await getProjectById(projectId);
  const lists = await getProjectListsId(project.id);

  const onlyIds = lists.map((list) => list.id);

  return {
    project,
    lists: onlyIds,
  };
}
