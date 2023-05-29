import { Zodios } from "@zodios/core";
import { z } from "zod";
import { List, CreateList } from "../interfaces/list";
import { Todo, TodoPatch, CreateTodo, TodoWithoutId } from "../interfaces/todo";

const api = new Zodios("http://127.0.0.1:6969/api/v1", [
  {
    method: "get",
    path: "/list",
    alias: "getAllLists",
    description: "Get all the lists",
    response: z.array(List),
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "get",
    path: "/list/:id",
    alias: "getList",
    description: "Get single list",
    response: List,
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "get",
    path: "/todo/:id",
    alias: "getTodo",
    description: "Get single todo",
    response: Todo,
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "patch",
    path: "/todo/:id",
    alias: "updateTodo",
    description: "Update todo",
    parameters: [
      {
        name: "todo",
        type: "Body",
        schema: TodoPatch,
      },
    ],
    response: TodoWithoutId,
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "post",
    path: "/list",
    alias: "createList",
    description: "Create new list",
    parameters: [
      {
        name: "todo",
        type: "Body",
        schema: CreateList,
      },
    ],
    response: List.omit({ todos: true }),
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "post",
    path: "/todo",
    alias: "createTodo",
    description: "Create new todo",
    parameters: [
      {
        name: "todo",
        type: "Body",
        schema: CreateTodo,
      },
    ],
    response: Todo,
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "delete",
    path: "/todo/:id",
    alias: "deleteTodo",
    description: "Delete todo",
    response: z.object({}),
    errors: [
      {
        status: "default",
        schema: z.object({
          message: z.string(),
        }),
      },
    ],
  },
]);

export default api;
