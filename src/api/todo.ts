import http from "../utils/http";
import type { Todo } from "../components/types";

export const fetchAll = () => {
    return http.get("/todos");
}

export const fetchById = (id: string) => {
    return http.get(`/todos/${id}`);

}

export const deleteById = (id: string) => {
    return http.delete(`/todos/${id}`);
}

export const create = (data: Omit<Todo, "_id">) => {
    return http.post("/todos", data);
}

export const update = (id: string, data: Omit<Todo, "_id">) => {
    return http.put(`/todos/${id}`, data);
}