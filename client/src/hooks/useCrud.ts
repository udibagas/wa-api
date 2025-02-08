import { Dayjs } from "dayjs";
import { Form, message, Modal } from "antd";
import { useCallback, useMemo, useState } from "react";
import { AxiosErrorResponseType, RecursivePartial } from "../types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createItem, deleteItem, getItems, updateItem } from "../api/client";
import { AxiosError } from "axios";
import apolloClient from "../apollo/client";

const useCrud = <T extends { id?: number }>(
  endpoint: string,
  queryKey: string
) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<T>();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<Record<string, string>>({
    status: "all",
  });

  const params = useMemo(
    () => ({ page: currentPage, limit: pageSize, search, ...filter }),
    [currentPage, pageSize, search, filter]
  );

  function useFetch<D = T[]>() {
    return useQuery({
      queryKey: [queryKey, params],
      queryFn: () => getItems<D>(endpoint, params),
      staleTime: 60 * 1000 * 10, // 10 minutes
    });
  }

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [queryKey],
    });

    queryClient.invalidateQueries({
      queryKey: ["masterData"],
    });

    apolloClient.cache.reset();
  }, [queryKey, queryClient]);

  const handleAdd = useCallback(() => {
    form.resetFields();
    setIsEditing(false);
    setShowForm(true);
  }, [form]);

  const handleEdit = useCallback(
    (
      data: RecursivePartial<T>,
      additionalData: Record<
        string,
        string | number | boolean | Dayjs | null | number[]
      > = {}
    ) => {
      form.setFieldsValue({ ...data, ...additionalData });
      setIsEditing(true);
      setShowForm(true);
    },
    [form]
  );

  const handleModalClose = useCallback(() => {
    setShowForm(false);
    form.resetFields();
    setErrors({});
  }, [form]);

  const handleSubmit = useCallback(
    async (values: T) => {
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
    },
    [endpoint, form, refreshData]
  );

  const handleDelete = useCallback(
    (id: number) => {
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
    },
    [endpoint, refreshData]
  );

  return {
    form,
    errors,
    showForm,
    isEditing,
    currentPage,
    pageSize,
    search,
    filter,
    params,
    setShowForm,
    useFetch,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleDelete,
    handleModalClose,
    refreshData,
    setCurrentPage,
    setPageSize,
    setSearch,
    setFilter,
  };
};

export default useCrud;
