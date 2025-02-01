import React, { useState } from "react";
import { Table, Form } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import useCrud from "../hooks/useCrud";
import RecipientForm from "../components/RecipientForm";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { RecipientType } from "../types";

const App: React.FC = () => {
  const { data: apps, errors, setErrors, addItem, updateItem, showDeleteConfirm } = useCrud<RecipientType>("/recipients");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleAddData = () => {
    setIsEditing(false);
    form.setFieldsValue({ name: "", phoneNumber: "" });
    setIsModalVisible(true);
  };

  const handleEditApp = (data: RecipientType) => {
    setIsEditing(true);
    form.setFieldsValue(data);
    setIsModalVisible(true);
  };

  const handleModalOk = async (values: RecipientType) => {
    try {
      if (values.id) {
        await updateItem(values.id, values);
      } else {
        await addItem(values);
      }
      handleModalClose();
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const handleModalClose = () => {
    setErrors({});
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      key: "id",
      render: (_: string, __: RecipientType, index: number) => index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: <SettingOutlined />,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: string, record: RecipientType) => (
        <ActionButton onEdit={() => handleEditApp(record)} onDelete={() => showDeleteConfirm(record.id)} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Recipient Management"
        subtitle="Manage recipients"
      >
        <AddButton label="Add New Recipient" onClick={handleAddData} />
      </PageHeader>
      <Table
        size="small"
        columns={columns}
        dataSource={apps}
        rowKey="id"
        pagination={false}
        onRow={(record: RecipientType) => {
          return {
            onDoubleClick: () => handleEditApp(record),
          };
        }}
      />

      <RecipientForm
        visible={isModalVisible}
        isEditing={isEditing}
        onCancel={handleModalClose}
        onOk={handleModalOk}
        errors={errors}
        form={form}
        initialValues={{ name: "", phoneNumber: "" } as RecipientType}
      />
    </div>
  );
};

export default App;