import React, { useState } from "react";
import { Table, Form } from "antd";
import useCrud from "../hooks/useCrud";
import UserForm from "../components/UserForm";
import PageHeader from "../components/PageHeader";
import { SettingOutlined } from "@ant-design/icons";
import ActionButton from "../components/buttons/ActionButton";
import AddButton from "../components/buttons/AddButton";
import { UserType } from "../types";

const User: React.FC = () => {
  const { data: users, errors, setErrors, addItem, updateItem, showDeleteConfirm } = useCrud<UserType>("/users");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleAddUser = () => {
    setIsEditing(false);
    form.setFieldsValue({ name: "", email: "", password: "" });
    setIsModalVisible(true);
  };

  const handleEditUser = (user: UserType) => {
    setIsEditing(true);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleModalOk = async (values: UserType) => {
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

  const columns = [
    {
      title: "No",
      width: 60,
      render: (_: string, __: UserType, index: number) => index + 1
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: <SettingOutlined />,
      key: "action",
      align: "center" as const,
      width: 80,
      render: (_: string, record: UserType) => (
        <ActionButton
          onEdit={() => handleEditUser(record)}
          onDelete={() => showDeleteConfirm(record.id)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="User Management" subtitle="Manage your users">
        <AddButton label="Create New User" onClick={handleAddUser} />
      </PageHeader>

      <Table
        size="small"
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={false}
        onRow={(record: UserType) => {
          return {
            onDoubleClick: () => handleEditUser(record),
          };
        }}
      />

      <UserForm
        visible={isModalVisible}
        isEditing={isEditing}
        onCancel={handleModalClose}
        onOk={handleModalOk}
        errors={errors}
        form={form}
      />
    </div>
  );
};

export default User;