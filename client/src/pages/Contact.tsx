import React, { useCallback } from "react";
import { Input, Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import ContactForm from "../features/recipients/ContactForm";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { PaginatedData, ContactType } from "../types";
import dayjs from "dayjs";
import useCrud from "../hooks/useCrud";

const Contact: React.FC = () => {
  const {
    useFetch,
    refreshData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleModalClose,
    handleSubmit,
    setCurrentPage,
    setPageSize,
    setSearch,
    errors,
    form,
    showForm,
    isEditing,
    currentPage,

  } = useCrud<ContactType>("/contacts", "contacts");

  const { data, isPending } = useFetch<PaginatedData<ContactType>>();

  const prepareEdit = useCallback((record: ContactType) => {
    return handleEdit(record, {
      dateOfBirth: record.dateOfBirth ? dayjs(record.dateOfBirth) : null,
      groups: record.groups.map((group) => group.id),
    });
  }, [handleEdit]);

  const columns = [
    {
      title: "No.",
      width: 60,
      key: "id",
      render: (_: string, __: ContactType, index: number) => currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name", ellipsis: true },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber", ellipsis: true },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      ellipsis: true,
      render: (_: string, record: ContactType) => {
        return record.dateOfBirth ? dayjs(record.dateOfBirth).format("DD-MMM-YYYY") : "-";
      }
    },
    { title: "Age", dataIndex: "age", key: "age" },
    {
      title: "Group",
      key: "groups",
      ellipsis: true,
      render: (_: string, record: ContactType) => {
        return record.groups.map((group) => group.name).join(", ");
      }
    },
    {
      title: <ReloadOutlined onClick={() => refreshData()} />,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: string, record: ContactType) => (
        <ActionButton
          onDelete={() => handleDelete(record.id as number)}
          onEdit={() => prepareEdit(record)}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Contact Management"
        subtitle="Manage contacts"
      >
        <AddButton label="Add New Contact" onClick={handleAdd} />
        <Input.Search
          placeholder="Search contact..."
          onSearch={(value) => setSearch(value)}
          style={{ width: 200 }}
          allowClear
        />
      </PageHeader>

      <Table
        scroll={{ y: 41 * 10 }}
        loading={isPending}
        size="small"
        columns={columns}
        dataSource={data?.rows ?? []}
        rowKey="id"
        pagination={{
          size: "small",
          current: currentPage,
          total: data?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            setPageSize(pageSize);
            setCurrentPage(page);
          },
        }}
        onRow={(record: ContactType) => {
          return {
            onDoubleClick: () => prepareEdit(record),
          };
        }}
      />

      <ContactForm
        visible={showForm}
        isEditing={isEditing}
        onCancel={handleModalClose}
        onOk={handleSubmit}
        errors={errors}
        form={form}
      />
    </>
  );
};

export default Contact;