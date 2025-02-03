import React from "react";
import { Input, Table } from "antd";
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
    total,
    currentPage,
    form,
    errors,
    isEditing,
    isModalVisible,
    isLoading,
    showDeleteConfirm,
    fetchData,
    handleAdd,
    handleEdit,
    handleModalOk,
    handleModalClose,
    setCurrentPage,
    setPageSize,
    setSearch
  } = useCrud<RecipientType>("/recipients", true);

  const columns = [
    {
      title: "No.",
      width: 60,
      key: "id",
      render: (_: string, __: RecipientType, index: number) => currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Group", key: "groups", render: (_: string, record: RecipientType) => {
        return record.groups.map((group) => group.name).join(", ");
      }
    },
    {
      title: <ReloadOutlined onClick={() => fetchData()} />,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: string, record: RecipientType) => (
        <ActionButton onEdit={() => handleEdit(record)} onDelete={() => showDeleteConfirm(record.id as number)} />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Recipient Management"
        subtitle="Manage recipients"
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: '1em' }}>
          <AddButton label="Add New Recipient" onClick={handleAdd} />
          <Input.Search
            placeholder="Search recipient..."
            onSearch={(value) => setSearch(value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>

      </PageHeader>

      <Table
        loading={isLoading}
        size="small"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          size: "small",
          current: currentPage,
          total: total,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            // gak perlu fetch ulang karena sudah dihandle oleh useCrud
            setPageSize(pageSize);
            setCurrentPage(page);
          },
        }}
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
    </>
  );
};

export default App;