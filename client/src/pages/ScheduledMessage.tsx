import React from "react";
import { Switch, Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { ScheduledMessageType } from "../types";
import useCrud from "../hooks/useCrud";
import ScheduledMessageForm from "../components/ScheduledMessageForm";

const ScheduledMessage: React.FC = () => {
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
  } = useCrud<ScheduledMessageType>("/scheduled-messages", "scheduled-messages");

  const { isPending, data } = useFetch();

  const columns = [
    { title: "ID", dataIndex: 'id', key: "id", width: 60 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Time", dataIndex: "time", key: "time" },
    {
      title: "Recurring",
      render: (_: string, record: ScheduledMessageType) => {
        return <Switch checked={record.recurring} disabled size="small" />
      }
    },
    {
      title: "Contacts",
      render: (_: string, record: ScheduledMessageType) => {
        return record.contacts.length
      }
    },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: string, record: ScheduledMessageType) => (
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
        title="Scheduled Message"
        subtitle="Manage your scheduled message"
      >
        <AddButton label="Create New Scheduled Message" onClick={handleAdd} />
      </PageHeader>

      <Table
        loading={isPending}
        size="small"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        onRow={(record: ScheduledMessageType) => {
          return {
            onDoubleClick: () => handleEdit(record),
          };
        }}
      />

      <ScheduledMessageForm
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

export default ScheduledMessage;