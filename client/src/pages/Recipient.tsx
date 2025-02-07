import React, { useEffect, useMemo } from "react";
import { Input, Table } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import RecipientForm from "../components/RecipientForm";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { PaginatedData, RecipientType } from "../types";
import { createStyles } from 'antd-style';
import dayjs from "dayjs";
import useForm from "../hooks/useForm";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const Recipient: React.FC = () => {
  const { styles } = useStyle();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const {
    useFetch,
    refreshData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleModalClose,
    handleSubmit,
    errors,
    form,
    showForm,
    isEditing,
  } = useForm<RecipientType>("/recipients", "recipients");

  const params = useMemo(
    () => ({ page: currentPage, limit: pageSize, search }),
    [currentPage, pageSize, search]
  );

  const { data, isPending } = useFetch<PaginatedData<RecipientType>>(params);

  useEffect(() => {
    refreshData();
  }, [params]);

  const prepareEdit = (record: RecipientType) => {
    return handleEdit(record, {
      dateOfBirth: record.dateOfBirth ? dayjs(record.dateOfBirth) : null,
      groups: record.groups.map((group) => group.id),
    });
  }

  const columns = [
    {
      title: "No.",
      width: 60,
      key: "id",
      render: (_: string, __: RecipientType, index: number) => currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name", ellipsis: true },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber", ellipsis: true },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      ellipsis: true,
      render: (_: string, record: RecipientType) => {
        return record.dateOfBirth ? dayjs(record.dateOfBirth).format("DD-MMM-YYYY") : "-";
      }
    },
    { title: "Age", dataIndex: "age", key: "age" },
    {
      title: "Group",
      key: "groups",
      ellipsis: true,
      render: (_: string, record: RecipientType) => {
        return record.groups.map((group) => group.name).join(", ");
      }
    },
    {
      title: <ReloadOutlined onClick={() => refreshData()} />,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: string, record: RecipientType) => (
        <ActionButton
          onDelete={() => handleDelete(record.id as number)}
          onEdit={() => prepareEdit(record)}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Recipient Management"
        subtitle="Manage recipients"
      >
        <AddButton label="Add New Recipient" onClick={handleAdd} />
        <Input.Search
          placeholder="Search recipient..."
          onSearch={(value) => setSearch(value)}
          style={{ width: 200 }}
          allowClear
        />
      </PageHeader>

      <Table
        className={styles.customTable}
        scroll={{ y: 49 * 10 }}
        loading={isPending}
        size="small"
        columns={columns}
        dataSource={data?.rows ?? []}
        rowKey="id"
        pagination={{
          size: "small",
          current: currentPage,
          total: data?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            setPageSize(pageSize);
            setCurrentPage(page);
          },
        }}
        onRow={(record: RecipientType) => {
          return {
            onClick: () => prepareEdit(record),
          };
        }}
      />

      <RecipientForm
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

export default Recipient;