import React, { useState } from "react";
import { Table, Button, Form } from "antd";
import useCrud from "../hooks/useCrud";
import UserForm from "../components/UserForm";
import PageHeader from "../components/PageHeader";
import { EditOutlined, DeleteOutlined, SettingOutlined, PlusOutlined } from "@ant-design/icons";

type UserType = {
  id: number;
  name: string;
  email: string;
}

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
    } catch (error: any) {
      console.log(error.message);
    }


  };

  const handleModalClose = () => {
    setErrors({});
    setIsModalVisible(false);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: <SettingOutlined />,
      key: "action",
      width: 80,
      align: "center",
      render: (text, record: UserType) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditUser(record)} />
          <Button type="link" icon={<DeleteOutlined />} danger onClick={() => showDeleteConfirm(record.id)} />
        </>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Manage your users"
        buttonText="Add User"
        onButtonClick={handleAddUser}
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
          Add User
        </Button>
      </PageHeader>

      <Table size="small" columns={columns} dataSource={users} rowKey="id" pagination={false} />


      <UserForm
        visible={isModalVisible}
        isEditing={isEditing}
        onCancel={handleModalClose}
        onOk={handleModalOk}
        initialValues={{ name: "", email: "" } as UserType}
        errors={errors}
        form={form}
      />
    </div>
  );
};

export default User;