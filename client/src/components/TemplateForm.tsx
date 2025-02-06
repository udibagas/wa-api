import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";
import { AppType, CustomFormProps, FileType, TemplateType } from "../types";
import TextArea from "antd/es/input/TextArea";
import axiosInstance from "../utils/axiosInstance";
import WhatsAppChatBubble from "./WhatsAppChatBubble";

const TemplateForm: React.FC<CustomFormProps<TemplateType>> = ({ visible, isEditing, onCancel, onOk, errors, form }) => {
  const [apps, setApps] = useState([]);
  const message = Form.useWatch('body', form);

  useEffect(() => {
    axiosInstance.get("/apps").then((response) => {
      setApps(response.data);
    });

    return () => {
      setApps([]);
    };
  }, [])

  return (
    <Modal
      width={800}
      title={isEditing ? "Edit Template" : "Create New Template"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <CancelButton label="Cancel" onCancel={onCancel} key='back' />,
        <SaveButton label={isEditing ? "Update" : "Add"} key='submit' />,
      ]}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
        <Form
          style={{ width: 400 }}
          variant="filled"
          form={form}
          id="form"
          onFinish={onOk}
          requiredMark={false}
          labelCol={{ span: 7 }}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="appId"
            label="App"
            validateStatus={errors.appId ? "error" : ""}
            help={errors.appId?.join(", ")}
          >
            <Select
              placeholder="Select App"
              allowClear
              options={apps.map((group: AppType) => ({ label: group.name, value: group.id }))}
            >
            </Select>
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
            label="Body"
            name="body"
            validateStatus={errors.body ? "error" : ""}
            help={errors.body?.join(", ")}
          >
            <TextArea
              autoSize={{ minRows: 8, maxRows: 10 }}
              maxLength={4096}
              showCount />
          </Form.Item>
        </Form>

        <WhatsAppChatBubble message={message} file={{} as FileType} />
      </div>

    </Modal>
  );
};

export default TemplateForm;