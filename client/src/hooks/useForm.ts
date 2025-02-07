import { Dayjs } from "dayjs";
import { Form, message, Modal } from "antd";
import { useState } from "react";
import { AxiosErrorResponseType, RecursivePartial } from "../types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createItem, deleteItem, getItems, updateItem } from "../api/client";
import { AxiosError } from "axios";

const useForm = <T extends { id?: number }>(
  endpoint: string,
  queryKey: string
) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<T>();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  function useFetch<D = T[]>(
    params: Record<string, string | number | boolean> = {}
  ) {
    return useQuery({
      queryKey: [queryKey],
      queryFn: () => getItems<D>(endpoint, params),
    });
  }

  function refreshData() {
    queryClient.invalidateQueries({
      queryKey: [queryKey],
    });
  }

  function handleAdd() {
    form.resetFields();
    setIsEditing(false);
    setShowForm(true);
  }

  function handleEdit(
    data: RecursivePartial<T>,
    additionalData: Record<
      string,
      string | number | boolean | Dayjs | null | number[]
    > = {}
  ) {
    form.setFieldsValue({ ...data, ...additionalData });
    setIsEditing(true);
    setShowForm(true);
  }

  function handleModalClose() {
    setShowForm(false);
    form.resetFields();
    setErrors({});
  }

  async function handleSubmit(values: T) {
    try {
      const res = values.id
        ? await updateItem(endpoint, values.id, values)
        : await createItem(endpoint, values);

      console.log(res);
      message.success("Record saved successfully");
      form.resetFields();
      setErrors({});
      setShowForm(false);
      refreshData();
    } catch (error) {
      const axiosError = error as AxiosError;
      const axiosErrorResponse = axiosError.response
        ?.data as AxiosErrorResponseType;

      if (axiosError.response?.status === 400) {
        setErrors(axiosErrorResponse.errors ?? {});
      }
    }
  }

  function handleDelete(id: number) {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        deleteItem(endpoint, id).then(() => {
          refreshData();
        });
      },
    });
  }

  return {
    form,
    errors,
    showForm,
    isEditing,
    setShowForm,
    useFetch,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleDelete,
    handleModalClose,
    refreshData,
  };
};

export default useForm;
