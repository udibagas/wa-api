import { useState, useEffect } from "react";
import { FormInstance, message, Modal } from "antd";
import axiosInstance from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { Form } from "antd";
import { AxiosErrorResponseType, RecursivePartial } from "../types";

type CrudHook<T> = {
  data: T[];
  form: FormInstance<T>;
  errors: Record<string, string[]>;
  isEditing: boolean;
  isModalVisible: boolean;
  setErrors: (errors: Record<string, string[]>) => void;
  fetchData: () => void;
  addItem: (item: T) => Promise<void>;
  updateItem: (id: number, item: T) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  showDeleteConfirm: (id: number) => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsModalVisible: (isVisible: boolean) => void;
  handleAdd: () => void;
  handleEdit: (data: T) => void;
  handleModalOk: (values: T) => void;
  handleModalClose: () => void;
};

const useCrud = <T extends { id?: number }>(endpoint: string): CrudHook<T> => {
  const [data, setData] = useState<T[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [form] = Form.useForm<T>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(endpoint);
      setData(response.data);
    } catch (error) {
      message.error((error as AxiosError).message);
    }
  };

  const handleError = (error: unknown) => {
    const axiosError = error as AxiosError;
    const axiosErrorResponse = axiosError.response
      ?.data as AxiosErrorResponseType;

    if (axiosError.response?.status === 400) {
      setErrors(axiosErrorResponse.errors ?? {});
    }

    message.error(axiosErrorResponse.message ?? axiosError.message);
    throw error; // rethrow the error so that the caller can handle it
  };

  const addItem = async (item: T) => {
    try {
      await axiosInstance.post(endpoint, item);
      message.success("Item added successfully");
      fetchData();
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const updateItem = async (id: number, item: T) => {
    try {
      await axiosInstance.put(`${endpoint}/${id}`, item);
      message.success("Item updated successfully");
      fetchData();
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
      message.success("Item deleted successfully");
      fetchData();
    } catch (error) {
      handleError(error);
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

  const handleAdd = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (data: T) => {
    setIsEditing(true);
    form.setFieldsValue(data as RecursivePartial<T>);
    setIsModalVisible(true);
  };

  const handleModalOk = async (values: T) => {
    try {
      if (values.id) {
        await updateItem(values.id, values);
      } else {
        await addItem(values);
      }
      handleModalClose();
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const handleModalClose = () => {
    setErrors({});
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchData();

    return () => {
      setData([]);
    };
  }, []);

  return {
    data,
    errors,
    form,
    isModalVisible,
    isEditing,
    setErrors,
    fetchData,
    addItem,
    updateItem,
    deleteItem,
    showDeleteConfirm,
    setIsEditing,
    setIsModalVisible,
    handleAdd,
    handleEdit,
    handleModalOk,
    handleModalClose,
  };
};

export default useCrud;
