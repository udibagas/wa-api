import React from "react";
import { Table } from "antd";
import useCrud from "../hooks/useCrud";
import UserForm from "../components/UserForm";
import PageHeader from "../components/PageHeader";
import { ReloadOutlined } from "@ant-design/icons";
import ActionButton from "../components/buttons/ActionButton";
import AddButton from "../components/buttons/AddButton";
import { UserType } from "../types";

const User: React.FC = () => {
  const {
    data,
    form,
    errors,
    isEditing,
    isModalVisible,
    isLoading,
    showDeleteConfirm,
    handleAdd,
    handleEdit,
    handleModalOk,
    handleModalClose,
    refreshData,
  } = useCrud<UserType>("/users");


  const columns = [
    {
      title: "No.",
      width: 60,
      render: (_: string, __: UserType, index: number) => index + 1
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      align: "center" as const,
      width: 80,
      render: (_: string, record: UserType) => (
        <ActionButton
          onEdit={() => handleEdit(record)}
          onDelete={() => showDeleteConfirm(record.id)}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader title="User Management" subtitle="Manage your users">
        <AddButton label="Create New User" onClick={handleAdd} />
      </PageHeader>

      <Table
        loading={isLoading}
        size="small"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        onRow={(record: UserType) => {
          return {
            onDoubleClick: () => handleEdit(record),
          };
        }}
      />

      <UserForm
        visible={isModalVisible}
        isEditing={isEditing}
        errors={errors}
        form={form}
        onCancel={handleModalClose}
        onOk={handleModalOk}
      />
    </>
  );
};

export default User;