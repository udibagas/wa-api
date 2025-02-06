import React from "react";
import { Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { TemplateType } from "../types";
import TemplateForm from "../components/TemplateForm";
import useForm from "../hooks/useForm";

const App: React.FC = () => {
  const {
    useFetch,
    refreshData,
    handleEdit,
    handleDelete,
    handleAdd,
    handleModalClose,
    handleSubmit,
    form,
    showForm,
    errors,
    isEditing
  } = useForm<TemplateType>("/message-templates", "message-templates");

  const { isPending, data } = useFetch();

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
        <ActionButton
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record.id)}
        />
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
        loading={isPending}
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
        visible={showForm}
        isEditing={isEditing}
        onCancel={handleModalClose}
        onOk={handleSubmit}
        errors={errors}
        form={form}
      />
    </>
  );
};

export default App;