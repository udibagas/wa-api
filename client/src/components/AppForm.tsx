import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";
import { AppType, CustomFormProps } from "../types";
import { SettingOutlined } from "@ant-design/icons";
import axiosInstance from "../utils/axiosInstance";
import TextArea from "antd/es/input/TextArea";

const AppForm: React.FC<CustomFormProps<AppType>> = ({ visible, isEditing, onCancel, onOk, errors, form }) => {
  const generateToken = () => {
    const id = form.getFieldValue("id");
    axiosInstance.post(`/apps/${id}/token`).then(({ data }) => {
      const { token } = data;
      form.setFieldsValue({ token });
    });
  }

  const handleCopyToClipboard = () => {
    const appToken = form.getFieldValue("token");
    navigator.clipboard.writeText(appToken)
      .then(() => {
        message.success('App Token copied to clipboard!');
      })
      .catch((err) => {
        message.error('Failed to copy App Token.');
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <Modal
      width={500}
      title={isEditing ? "Edit App" : "Create New App"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <CancelButton label="Cancel" onCancel={onCancel} key='back' />,
        (isEditing && <Button key="generate" type="primary" icon={<SettingOutlined />} onClick={generateToken}>
          Generate Token
        </Button>),
        <SaveButton label={isEditing ? "Update" : "Add"} key='submit' />,
      ]}
    >
      <Form
        variant="filled"
        form={form}
        id="form"
        onFinish={onOk}
        requiredMark={false}
        labelCol={{ span: 6 }}
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
          <Input placeholder="App Name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          validateStatus={errors.description ? "error" : ""}
          help={errors.description?.join(", ")}
        >
          <Input placeholder="App Description" />
        </Form.Item>

        <Form.Item
          label="Token"
          name="token"
          help="Click to copy to clipboard"
          style={{ marginBottom: 30 }}
        >
          <TextArea
            placeholder="App Token"
            readOnly
            autoSize={{ minRows: 2, }}
            onClick={handleCopyToClipboard}
            style={{ cursor: "pointer" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppForm;