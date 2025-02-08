import React from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";
import { CustomFormProps, GroupType, RecipientType } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "../api/client";

const RecipientForm: React.FC<CustomFormProps<RecipientType>> = ({ visible, isEditing, onCancel, onOk, errors, form }) => {
  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getItems<GroupType[]>("/groups"),
    staleTime: 60 * 1000 * 10, // 10 minutes
  });

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
          <Input placeholder="Name" allowClear />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          validateStatus={errors.phoneNumber ? "error" : ""}
          help={errors.phoneNumber?.join(", ")}
        >
          <Input placeholder="Phone Number" allowClear />
        </Form.Item>

        <Form.Item label="Date of Birth" name="dateOfBirth">
          <DatePicker
            allowClear
            placeholder="Select date"
            format={"DD-MMM-YYYY"}
            style={{ width: '100%' }}
          />
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
            options={groups?.map((group) => ({ label: group.name, value: group.id })) ?? []}
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