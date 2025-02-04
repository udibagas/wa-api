import { PaginatedData, RecipientType } from "./../types/index";
import { useState, useEffect, useMemo } from "react";
import { FormInstance, message, Modal } from "antd";
import axiosInstance from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { Form } from "antd";
import { AxiosErrorResponseType, RecursivePartial } from "../types";

export type CrudHook<T> = {
  data: T[];
  total: number;
  currentPage: number;
  pageSize: number;
  search: string;
  filter: Record<string, number | string>;
  form: FormInstance<T>;
  errors: Record<string, string[]>;
  isEditing: boolean;
  isModalVisible: boolean;
  isLoading: boolean;
  setErrors: (errors: Record<string, string[]>) => void;
  fetchData: (query?: Record<string, number | string>) => void;
  addItem: (item: T) => Promise<void>;
  updateItem: (id: number, item: T) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  showDeleteConfirm: (id: number) => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsModalVisible: (isVisible: boolean) => void;
  handleAdd: () => void;
  handleEdit: (data: RecursivePartial<T>) => void;
  handleModalOk: (values: T) => void;
  handleModalClose: () => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setFilter: (filter: Record<string, number | string>) => void;
  refreshData: () => void;
};

const useCrud = <T extends { id?: number }>(
  endpoint: string,
  paginated: boolean = false
): CrudHook<T> => {
  const [data, setData] = useState<T[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [form] = Form.useForm<T>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // pagination
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Record<string, number | string>>({});

  const params = useMemo(
    () => ({ page: currentPage, limit: pageSize, search, ...filter }),
    [currentPage, pageSize, search, filter]
  );

  const refreshData = () => {
    setCurrentPage(1);
    setSearch("");
    setFilter({});
    // no need to call fetchData here because useEffect will take care of it
  };

  const fetchData = async (query = {}) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.get(endpoint, {
        params: { ...params, ...query },
      });

      if (!paginated) {
        setData(response.data);
        return;
      }

      const data = response.data as PaginatedData<T>;
      setData(data.rows);
      setTotal(data.total);
    } catch (error) {
      message.error((error as AxiosError).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    const axiosError = error as AxiosError;
    const axiosErrorResponse = axiosError.response
      ?.data as AxiosErrorResponseType;

    if (axiosError.response?.status === 400) {
      setErrors(axiosErrorResponse.errors ?? {});
    }

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

  const handleEdit = (data: RecursivePartial<T>) => {
    setIsEditing(true);
    form.setFieldsValue(data);

    // handle logic untuk masing-masing form
    if ((data as RecipientType).groups) {
      const groups = (data as RecipientType).groups.map((group) => group.id);
      form.setFieldsValue({ ...data, groups });
    }

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
    let ignore = false;
    setIsLoading(true);

    axiosInstance
      .get(endpoint, { params })
      .then((response) => {
        if (ignore) return;

        if (!paginated) {
          setData(response.data);
          return;
        }

        const data = response.data as PaginatedData<T>;
        setData(data.rows);
        setTotal(data.total);
      })
      .catch((error) => {
        if (ignore) return;
        message.error((error as AxiosError).message);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [endpoint, params, paginated]);

  return {
    data,
    total,
    currentPage,
    pageSize,
    search,
    filter,
    errors,
    form,
    isModalVisible,
    isEditing,
    isLoading,
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
    setCurrentPage,
    setPageSize,
    setSearch,
    setFilter,
    refreshData,
  };
};

export default useCrud;
