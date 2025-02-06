import React from "react";
import { Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import useCrud from "../hooks/useCrud";
import AppForm from "../components/AppForm";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { AppType } from "../types";

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
  } = useCrud<AppType>("/apps");


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
        <ActionButton onEdit={() => handleEdit(record)} onDelete={() => showDeleteConfirm(record.id)} />
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
        loading={isLoading}
        size="small"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        onRow={(record: AppType) => {
          return {
            onClick: () => handleEdit(record),
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
      />
    </>
  );
};

export default App;