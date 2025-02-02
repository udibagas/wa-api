import React from "react";
import { Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import useCrud from "../hooks/useCrud";
import RecipientForm from "../components/RecipientForm";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { RecipientType } from "../types";

const App: React.FC = () => {
  const {
    data,
    form,
    errors,
    showDeleteConfirm,
    fetchData,
    handleAdd,
    handleEdit,
    handleModalOk,
    handleModalClose,
    isEditing,
    isModalVisible
  } = useCrud<RecipientType>("/recipients");

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
      title: "Group", key: "groups", render: (_: string, record: RecipientType) => {
        return record.groups.map((group) => group.name).join(", ");
      }
    },
    {
      title: <ReloadOutlined onClick={fetchData} />,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: string, record: RecipientType) => (
        <ActionButton onEdit={() => handleEdit(record)} onDelete={() => showDeleteConfirm(record.id as number)} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Recipient Management"
        subtitle="Manage recipients"
      >
        <AddButton label="Add New Recipient" onClick={handleAdd} />
      </PageHeader>
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        onRow={(record: RecipientType) => {
          return {
            onDoubleClick: () => handleEdit(record),
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
      />
    </div>
  );
};

export default App;