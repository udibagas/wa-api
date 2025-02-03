import React from "react";
import { Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import useCrud from "../hooks/useCrud";
import GroupForm from "../components/GroupForm";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { GroupType } from "../types";

const Group: React.FC = () => {
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
    isModalVisible,
    isLoading
  } = useCrud<GroupType>("/groups");

  const columns = [
    {
      title: "No.",
      width: 60,
      key: "id",
      render: (_: string, __: GroupType, index: number) => index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: <ReloadOutlined onClick={fetchData} />,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: string, record: GroupType) => (
        <ActionButton onEdit={() => handleEdit(record)} onDelete={() => showDeleteConfirm(record.id)} />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Group Management"
        subtitle="Manage your group"
      >
        <AddButton label="Create New Group" onClick={handleAdd} />
      </PageHeader>

      <Table
        loading={isLoading}
        size="small"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        onRow={(record: GroupType) => {
          return {
            onDoubleClick: () => handleEdit(record),
          };
        }}
      />

      <GroupForm
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

export default Group;