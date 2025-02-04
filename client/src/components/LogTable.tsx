import React from "react";
import { Table } from "antd";
import { LogType, StatusType } from "../types";
import useCrud from "../hooks/useCrud";
import moment from "moment";
import StatusTag from "./StatusTag";
import { ReloadOutlined } from "@ant-design/icons";
import { showDetailLog } from "../utils/showDetailLog";

const LogTable: React.FC = () => {
  const { data, isLoading, refreshData } = useCrud<LogType>("/logs", true);

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
      <Table
        loading={isLoading}
        size="small"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        onRow={(record: LogType) => {
          return {
            onClick: () => showDetailLog(record),
          };
        }}
      />
    </>
  );
};

export default LogTable;