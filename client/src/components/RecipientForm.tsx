import React from "react";
import { Modal, Form, Input, FormInstance, Select } from "antd";
const { Option } = Select;
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";

type RecipientType = {
  id: number;
  name: string;
  phoneNumber: string;
};

type RecipientFormProps = {
  visible: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onOk: (values: RecipientType) => void;
  initialValues: RecipientType;
  errors: { [key: string]: string[] };
  form: FormInstance<RecipientType>;
};

const RecipientForm: React.FC<RecipientFormProps> = ({ visible, isEditing, onCancel, onOk, initialValues, errors, form }) => {

  return (
    <Modal
      width={450}
      title={isEditing ? "Edit Recipient" : "Add Recipient"}
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
          label="Phone Number"
          name="phoneNumber"
          validateStatus={errors.phoneNumber ? "error" : ""}
          help={errors.phoneNumber?.join(", ")}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Group"
          validateStatus={errors.groups ? "error" : ""}
          help={errors.groups?.join(", ")}
        >
          <Select
            mode="multiple"
            placeholder="Select group(s)"
            allowClear
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>

      </Form>
    </Modal >
  );
};

export default RecipientForm;