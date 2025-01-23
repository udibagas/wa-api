import React from "react";
import { Modal, Form, Input, Button, FormInstance } from "antd";

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
      width={400}
      title={isEditing ? "Edit User" : "Add User"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
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
        initialValues={initialValues}
        onFinish={onOk}
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
  );
};

export default UserForm;