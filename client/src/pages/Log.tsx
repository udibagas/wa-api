import React from "react";
import PageHeader from "../components/PageHeader";
import { Input, Radio, Table } from "antd";
import { LogType, StatusType } from "../types";
import useCrud from "../hooks/useCrud";
import { ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import StatusTag from "../components/StatusTag";
import { showDetailLog } from "../utils/showDetailLog";

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
      dataIndex: "AppId",
      key: "AppId",
      render: (_: string, record: LogType) => record.app.name
    },
    {
      title: "Recipient",
      key: "recipient",
      render: (_: string, record: LogType) => record.recipient.name
    },
    {
      title: "Phone Number",
      key: "phoneNumber",
      render: (_: string, record: LogType) => record.recipient.phoneNumber
    },
    {
      title: "Template",
      key: "messageTemplate",
      render: (_: string, record: LogType) => record.messageTemplate.name
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
        <Radio.Group defaultValue='all' value={filter.status} onChange={(e) => {
          if (e.target.value) {
            setFilter({ status: e.target.value });
          }
        }}>
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="success">Success</Radio.Button>
          <Radio.Button value="failed">Failed</Radio.Button>
        </Radio.Group>

        <Input.Search
          placeholder="Search recipient..."
          onSearch={(value) => setSearch(value)}
          style={{ width: 200 }}
          allowClear
        />
      </PageHeader >

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