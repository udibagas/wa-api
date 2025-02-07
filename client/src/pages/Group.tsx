import React from "react";
import { Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import GroupForm from "../components/GroupForm";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { GroupType } from "../types";
import useForm from "../hooks/useCrud";

const Group: React.FC = () => {
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
  } = useForm<GroupType>("/groups", "groups");

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
      render: (_: string, record: GroupType) => (
        <ActionButton onEdit={() => handleEdit(record)} onDelete={() => handleDelete(record.id)} />
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
        loading={isPending}
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

export default Group;