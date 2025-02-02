import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";
import { AppType, CustomFormProps, TemplateType } from "../types";
import TextArea from "antd/es/input/TextArea";
import axiosInstance from "../utils/axiosInstance";


const TemplateForm: React.FC<CustomFormProps<TemplateType>> = ({ visible, isEditing, onCancel, onOk, errors, form }) => {
  const [apps, setApps] = useState([]);

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
      width={450}
      title={isEditing ? "Edit Template" : "Create New Template"}
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
        onFinish={onOk}
        requiredMark={false}
        labelCol={{ span: 8 }}
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
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Components"
          name="components"
          validateStatus={errors.components ? "error" : ""}
          help={errors.components?.join(", ")}
        >
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TemplateForm;