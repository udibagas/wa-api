import React from "react";
import { Modal, Form, Input, FormInstance } from "antd";
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";

type GroupType = {
  id: number;
  name: string;
  description: string;
};

type GroupFormProps = {
  visible: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onOk: (values: GroupType) => void;
  initialValues: GroupType;
  errors: { [key: string]: string[] };
  form: FormInstance<GroupType>;
};

const GroupForm: React.FC<GroupFormProps> = ({ visible, isEditing, onCancel, onOk, initialValues, errors, form }) => {
  return (
    <Modal
      width={450}
      title={isEditing ? "Edit Group" : "Create New Group"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <CancelButton label="Cancel" onCancel={onCancel} key='back' />,
        <SaveButton label={isEditing ? "Update" : "Add"} form="appForm" key='submit' />,
      ]}
    >
      <Form
        form={form}
        id="appForm"
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
          label="Description"
          name="description"
          validateStatus={errors.description ? "error" : ""}
          help={errors.description?.join(", ")}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GroupForm;