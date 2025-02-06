import React from "react";
import { Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import AppForm from "../components/AppForm";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { AppType } from "../types";
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
  } = useForm<AppType>("/apps", "apps");

  const { isPending, data } = useFetch();

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: string, record: AppType) => (
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
        title="App Management"
        subtitle="Manage your apps"
      >
        <AddButton label="Create New App" onClick={handleAdd} />
      </PageHeader>

      <Table
        loading={isPending}
        size="small"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        onRow={(record: AppType) => {
          return {
            onClick: () => { console.log(record) },
          };
        }}
      />

      <AppForm
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