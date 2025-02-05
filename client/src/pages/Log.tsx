import React from "react";
import PageHeader from "../components/PageHeader";
import { Button, Input, Modal, Popconfirm, Radio, Space, Table } from "antd";
import { LogType, StatusType } from "../types";
import useCrud from "../hooks/useCrud";
import { CloseCircleOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import StatusTag from "../components/StatusTag";
import { showDetailLog } from "../utils/showDetailLog";
import axiosInstance from "../utils/axiosInstance";
import { CheckCircleOutlined } from "@ant-design/icons";

const Log: React.FC = () => {

  const {
    data,
    isLoading,
    currentPage,
    total,
    filter,
    setCurrentPage,
    setPageSize,
    setSearch,
    setFilter,
    refreshData
  } = useCrud<LogType>("/logs", true);

  const columns = [
    {
      title: "Time",
      key: "createdAt",
      width: 180,
      render: (_: string, record: LogType) => moment(record.createdAt).format("DD-MMM-YYYY HH:mm:ss")
    },
    {
      title: "App",
      key: "AppId",
      dataIndex: ["app", 'name'],
    },
    {
      title: "Recipient",
      key: "recipient",
      dataIndex: ["recipient", 'name'],
    },
    {
      title: "Phone Number",
      key: "phoneNumber",
      dataIndex: ["recipient", 'phoneNumber'],
    },
    {
      title: "Template",
      key: "messageTemplate",
      dataIndex: ["messageTemplate", 'name'],
    },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "status",
      width: 150,
      align: "center" as const,
      render: (_: string, record: LogType) => <StatusTag status={record.status as StatusType} />
    },
  ];

  return (
    <>
      <PageHeader
        title="Logs"
        subtitle="Message logs"
      >
        <Popconfirm
          title="Clear Logs"
          description="Are you sure to delete all logs?"
          onConfirm={() => {
            axiosInstance.delete("/logs").then(() => {
              refreshData();
            });
          }}
          onCancel={() => { }}
          okText="Yes"
          cancelText="No"
        >
          <Button
            color="danger"
            variant="solid"
            icon={<DeleteOutlined />}
          >
            Clear Logs
          </Button>
        </Popconfirm>

        <Radio.Group defaultValue='all' value={filter.status} onChange={(e) => {
          if (e.target.value) {
            setFilter({ status: e.target.value });
          }
        }}>
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="success" style={{ color: 'green' }}>
            <Space>
              <CheckCircleOutlined style={{ color: 'green' }} />
              Success
            </Space>
          </Radio.Button>
          <Radio.Button value="failed" style={{ color: 'red' }}>
            <Space>
              <CloseCircleOutlined style={{ color: 'red' }} />
              Failed
            </Space>
          </Radio.Button>
        </Radio.Group>

        <Input.Search
          placeholder="Search recipient..."
          onSearch={(value) => setSearch(value)}
          style={{ width: 200 }}
          allowClear
        />
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
        onRow={(record: LogType) => {
          return {
            onClick: () => showDetailLog(record),
          };
        }}
      />

    </>
  );
};

export default Log;