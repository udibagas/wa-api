import React, { useContext, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Button, Form, Input, message } from "antd";
import { AxiosErrorResponseType, UserType } from "../types";
import axiosInstance from "../utils/axiosInstance";
import { AxiosError } from "axios";
import AuthContext from "../context/AuthContext";

const Profile: React.FC = () => {
  const { user, setUser } = useContext(AuthContext)
  const [form] = Form.useForm<UserType>();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function onOk(values: UserType) {
    try {
      const { data } = await axiosInstance.put(`/users/${(user as UserType).id}`, values);
      setUser(data);
      message.success("Profile updated successfully");
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const axiosErrorResponse = axiosError.response
        ?.data as AxiosErrorResponseType;

      if (axiosError.response?.status === 400) {
        setErrors(axiosErrorResponse.errors ?? {});
      }
    }
  }

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Manage your profile"
      >
      </PageHeader>

      <Form
        style={{ maxWidth: 400 }}
        variant="filled"
        id="form"
        form={form}
        onFinish={onOk}
        requiredMark={false}
        labelCol={{ span: 8 }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.join(", ")}
          initialValue={(user as UserType).name}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.join(", ")}
          initialValue={(user as UserType).email}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          validateStatus={errors.role ? "error" : ""}
          help={errors.role?.join(", ")}
          initialValue={(user as UserType).role}
        >
          <Input readOnly />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.join(", ")}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button block type="primary" htmlType="submit">
            SAVE
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Profile;