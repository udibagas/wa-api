import axios from "axios";
import { message } from "antd";
import { FileType } from "../types";

const client = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          message.error(data.message || "Bad Request");
          break;
        case 401:
          message.error(data.message || "Unauthorized");
          break;
        case 403:
          message.error(data.message || "Forbidden");
          break;
        case 404:
          message.error(data.message || "Not Found");
          break;
        case 500:
          message.error(data.message || "Internal Server Error");
          break;
        default:
          message.error(data.message || "An error occurred");
      }
    } else if (error.request) {
      message.error("No response received from server");
    } else {
      message.error("Error in setting up request");
    }

    return Promise.reject(error);
  }
);

export async function getItems<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  const { data } = await client.get<T>(endpoint, { params });
  return data;
}

export async function getItem<T>(endpoint: string, id: number): Promise<T> {
  const { data } = await client.get<T>(`${endpoint}/${id}`);
  return data;
}

export async function createItem<T>(endpoint: string, item: T): Promise<T> {
  const { data } = await client.post(endpoint, item);
  return data;
}

export async function updateItem<T>(
  endpoint: string,
  id: number,
  item: T
): Promise<T> {
  const { data } = await client.put(`${endpoint}/${id}`, item);
  return data;
}

export function deleteItem(endpoint: string, id: number): Promise<void> {
  return client.delete(`${endpoint}/${id}`);
}

export async function uploadFile(file: File): Promise<FileType> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await client.post("/upload", formData);
  return data;
}

export default client;
