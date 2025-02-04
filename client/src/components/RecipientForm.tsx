import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";
import axiosInstance from "../utils/axiosInstance";
import { CustomFormProps, GroupType, RecipientType } from "../types";

const RecipientForm: React.FC<CustomFormProps<RecipientType>> = ({ visible, isEditing, onCancel, onOk, errors, form }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axiosInstance.get("/groups").then((response) => {
      setGroups(response.data);
    });

    return () => {
      setGroups([]);
    };
  }, [])

  return (
    <Modal
      width={450}
      title={isEditing ? "Edit Recipient" : "Add Recipient"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <CancelButton label="Cancel" onCancel={onCancel} key='back' />,
        <SaveButton label={isEditing ? "Update" : "Add"} key='submit' />,
      ]}
    >
      <Form
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
          label="Date of Birth"
          name="dateOfBirth"
          validateStatus={errors.dateOfBirth ? "error" : ""}
          help={errors.dateOfBirth?.join(", ")}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="groups"
          label="Group"
          validateStatus={errors.groups ? "error" : ""}
          help={errors.groups?.join(", ")}
        >
          <Select
            mode="multiple"
            placeholder="Select group(s)"
            allowClear
            options={groups.map((group: GroupType) => ({ label: group.name, value: group.id }))}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
          </Select>
        </Form.Item>

      </Form>
    </Modal >
  );
};

export default RecipientForm;