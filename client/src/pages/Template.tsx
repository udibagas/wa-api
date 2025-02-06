import React from "react";
import { Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import useCrud from "../hooks/useCrud";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { TemplateType } from "../types";
import TemplateForm from "../components/TemplateForm";

const App: React.FC = () => {
  const {
    data,
    form,
    errors,
    showDeleteConfirm,
    refreshData,
    handleAdd,
    handleEdit,
    handleModalOk,
    handleModalClose,
    isEditing,
    isModalVisible,
    isLoading
  } = useCrud<TemplateType>("/message-templates");

  const columns = [
    { title: "ID", dataIndex: 'id', key: "id", width: 60 },
    { title: "App", dataIndex: ["App", "name"], key: "app" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: string, record: TemplateType) => (
        <ActionButton onEdit={() => handleEdit(record)} onDelete={() => showDeleteConfirm(record.id)} />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Template Management"
        subtitle="Manage your templates"
      >
        <AddButton label="Create New Template" onClick={handleAdd} />
      </PageHeader>

      <Table
        loading={isLoading}
        size="small"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        onRow={(record: TemplateType) => {
          return {
            onDoubleClick: () => handleEdit(record),
          };
        }}
      />

      <TemplateForm
        visible={isModalVisible}
        isEditing={isEditing}
        onCancel={handleModalClose}
        onOk={handleModalOk}
        errors={errors}
        form={form}
      />
    </>
  );
};

export default App;