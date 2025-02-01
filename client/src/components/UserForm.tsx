import React from "react";
import { Modal, Form, Input, FormInstance } from "antd";
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";

type UserType = {
  id: number;
  name: string;
  email: string;
};

type UserFormProps = {
  visible: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onOk: (values: UserType) => void;
  initialValues: UserType;
  errors: { [key: string]: string[] };
  form: FormInstance<UserType>;
};

const UserForm: React.FC<UserFormProps> = ({ visible, isEditing, onCancel, onOk, initialValues, errors, form }) => {

  return (
    <Modal
      width={450}
      title={isEditing ? "Edit User" : "Add User"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <CancelButton label="Cancel" onCancel={onCancel} key='back' />,
        <SaveButton label={isEditing ? "Update" : "Add"} form="userForm" key='submit' />,
      ]}
    >
      <Form
        variant="filled"
        id="userForm"
        form={form}
        initialValues={initialValues}
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
    </Modal >
  );
};

export default UserForm;