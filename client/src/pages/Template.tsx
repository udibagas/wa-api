import React from "react";
// import { message, Modal, Table } from "antd";
import { Table } from "antd";
// import { CheckOutlined, ReloadOutlined } from "@ant-design/icons";
import { ReloadOutlined } from "@ant-design/icons";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { TemplateType } from "../types";
import TemplateForm from "../components/TemplateForm";
import useCrud from "../hooks/useCrud";
// import client from "../api/client";

const Template: React.FC = () => {
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
  } = useCrud<TemplateType>("/message-templates", "message-templates");

  const { isPending, data } = useFetch();

  // const submit = (record: TemplateType) => {
  //   Modal.confirm({
  //     title: "Confirm",
  //     content: "Are you sure you want to submit this template? This action cannot be undone.",
  //     okText: "Yes",
  //     okType: "primary",
  //     cancelText: "No",
  //     onOk: () => submitTemplate(record),
  //   })
  // }

  // const submitTemplate = async (record: TemplateType) => {
  //   try {
  //     await client.patch(`/message-templates/${record.id}/submit`);
  //     message.success("Template submitted successfully");
  //     refreshData();
  //   } catch (error) {
  //     message.error((error as Error).message);
  //   }
  // }

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
        // additionalItems={[
        //   { key: "submit", label: 'Submit', icon: <CheckOutlined />, onClick: () => submit(record) }
        // ]}
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

export default Template;