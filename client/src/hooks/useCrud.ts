import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import axiosInstance from "../utils/axiosInstance";

type CrudHook<T> = {
  data: T[];
  errors: Record<string, string[]>;
  setErrors: (errors: Record<string, string[]>) => void;
  fetchData: () => void;
  addItem: (item: T) => Promise<void>;
  updateItem: (id: number, item: T) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  showDeleteConfirm: (userId: number) => void;
};

const useCrud = <T extends { id: number }>(endpoint: string): CrudHook<T> => {
  const [data, setData] = useState<T[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(endpoint);
      setData(response.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const addItem = async (item: T) => {
    try {
      await axiosInstance.post(endpoint, item);
      message.success("Item added successfully");
      fetchData();
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrors(error.response?.data?.errors ?? {});
      }

      message.error(error.response?.data?.message ?? error.message);
      throw error;
    }
  };

  const updateItem = async (id: number, item: T) => {
    try {
      await axiosInstance.put(`${endpoint}/${id}`, item);
      message.success("Item updated successfully");
      fetchData();
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrors(error.response?.data?.errors ?? {});
      }

      message.error(error.response?.data?.message ?? error.message);
      throw error;
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
      message.success("Item deleted successfully");
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message ?? error.message);
    }
  };

  const showDeleteConfirm = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => deleteItem(id),
    });
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return {
    data,
    errors,
    setErrors,
    fetchData,
    addItem,
    updateItem,
    deleteItem,
    showDeleteConfirm,
  };
};

export default useCrud;
