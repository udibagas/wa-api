import React from "react";
import { Modal, Form, Input } from "antd";
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";
import { CustomFormProps, GroupType } from "../types";

const GroupForm: React.FC<CustomFormProps<GroupType>> = ({ visible, isEditing, onCancel, onOk, initialValues, errors, form }) => {
  return (
    <Modal
      width={450}
      title={isEditing ? "Edit Group" : "Create New Group"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <CancelButton label="Cancel" onCancel={onCancel} key='back' />,
        <SaveButton label={isEditing ? "Update" : "Add"} key='submit' />,
      ]}
    >
      <Form
        form={form}
        id="form"
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