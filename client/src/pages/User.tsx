import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axiosInstance from "../utils/axiosInstance"; // Import the Axios instance

type UserType = {
  id: number;
  name: string;
  email: string;
}

type ErrorsType = {
  name: string[];
  email: string[];
  password: string[];
}

const User: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [errors, setErrors] = useState({} as ErrorsType);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

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

  const handleDeleteUser = async (userId: number) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message ?? error.message);
    }
  };

  const showDeleteConfirm = (userId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => handleDeleteUser(userId),
    });
  };

  const handleModalOk = async (values: UserType) => {
    try {
      if (values.id) {
        await axiosInstance.put(`/users/${values.id}`, values);
        message.success("User updated successfully");
      } else {
        await axiosInstance.post("/users", values);
        message.success("User added successfully");
      }
      setIsModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      console.log(error);

      if (error.response?.status === 400) {
        setErrors(error.response.data.errors);
      }

      message.error(error.response?.data?.message ?? error.message);
    }
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Action",
      key: "action",
      width: 200,
      align: "center",
      render: (text, record: UserType) => (
        <>
          <Button type="link" onClick={() => handleEditUser(record)}>Edit</Button>
          <Button type="link" danger onClick={() => showDeleteConfirm(record.id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>User Management</h1>
      <Button style={{ marginBottom: 20 }} type="primary" onClick={handleAddUser}>Add User</Button>
      <Table columns={columns} dataSource={users} rowKey="id" pagination={false} />

      <Modal
        width={400}
        title={isEditing ? "Edit User" : "Add User"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" form="userForm" htmlType="submit">
            {isEditing ? "Update" : "Add"}
          </Button>,
        ]}
      >
        <Form
          variant="filled"
          id="userForm"
          form={form}
          initialValues={{ name: "", email: "", password: "" }}
          onFinish={handleModalOk}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Name"
            name="name"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.join(", ")}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.join(", ")}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.join(", ")}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;