import React, { useState } from "react";
import { Table, Form } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import useCrud from "../hooks/useCrud";
import AppForm from "../components/AppForm";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";

type AppType = {
  id: number;
  name: string;
  description: string;
};

const App: React.FC = () => {
  const { data: apps, errors, setErrors, addItem, updateItem, showDeleteConfirm } = useCrud<AppType>("/apps");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleAddApp = () => {
    setIsEditing(false);
    form.setFieldsValue({ name: "", description: "" });
    setIsModalVisible(true);
  };

  const handleEditApp = (app: AppType) => {
    setIsEditing(true);
    form.setFieldsValue(app);
    setIsModalVisible(true);
  };

  const handleModalOk = async (values: AppType) => {
    console.log(values)
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
      render: (_: string, __: AppType, index: number) => index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: <SettingOutlined />,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: string, record: AppType) => (
        <ActionButton onEdit={() => handleEditApp(record)} onDelete={() => showDeleteConfirm(record.id)} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="App Management"
        subtitle="Manage your apps"
      >
        <AddButton label="Create New App" onClick={handleAddApp} />
      </PageHeader>
      <Table
        size="small"
        columns={columns}
        dataSource={apps}
        rowKey="id"
        pagination={false}
        onRow={(record: AppType) => {
          return {
            onDoubleClick: () => handleEditApp(record),
          };
        }}
      />

      <AppForm
        visible={isModalVisible}
        isEditing={isEditing}
        onCancel={handleModalClose}
        onOk={handleModalOk}
        errors={errors}
        form={form}
        initialValues={{ name: "", description: "" } as AppType}
      />
    </div>
  );
};

export default App;