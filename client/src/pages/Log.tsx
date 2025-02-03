import React from "react";
import PageHeader from "../components/PageHeader";
import { Button, Table } from "antd";
import { LogType } from "../types";
import useCrud from "../hooks/useCrud";
import { ReloadOutlined } from "@ant-design/icons";

const Log: React.FC = () => {

  const { data, isLoading, fetchData } = useCrud<LogType>("/logs");

  const columns = [
    { title: "Time", key: "createdAt" },
    { title: "App", dataIndex: "AppId", key: "AppId" },
    { title: "Recipient", dataIndex: "RecipientId", key: "RecipientId" },
    { title: "Template", dataIndex: "MessageTemplateId", key: "MessageTemplateId" },
    { title: "Response", key: "response", render: (_: string, record: LogType) => { return JSON.stringify(record) } },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <>
      <PageHeader
        title="Logs"
        subtitle="Message logs"
      >
        <Button onClick={fetchData} type="primary" icon={<ReloadOutlined />}>
          Refresh
        </Button>
      </PageHeader>

      <Table
        loading={isLoading}
        size="small"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
      />
    </>
  );
};

export default Log;