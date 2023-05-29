import api from "./api";

export function fetchLists() {
  return api.getAllLists();
}

export function fetchList(id: number) {
  return api.getList({ params: { id } });
}

export function fetchTodo(id: number) {
  return api.getTodo({ params: { id } });
}
