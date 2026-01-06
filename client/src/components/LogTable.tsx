import React from "react";
import { Table } from "antd";
import { LogType, PaginatedData, StatusType } from "../types";
import useCrud from "../hooks/useCrud";
import moment from "moment";
import StatusTag from "./StatusTag";
import { ReloadOutlined } from "@ant-design/icons";
import { showDetailLog } from "../utils/showDetailLog";

const LogTable: React.FC = React.memo(() => {
  const { useFetch, refreshData } = useCrud<LogType>("/logs", "logs");
  const { data, isPending } = useFetch<PaginatedData<LogType>>();

  const columns = [
    {
      title: "Time",
      key: "createdAt",
      width: 180,
      render: (_: string, record: LogType) => moment(record.createdAt).format("DD-MMM-YYYY HH:mm:ss")
    },
    {
      title: "Contact",
      key: "recipient",
      dataIndex: ["recipient", 'name'],
      ellipsis: true,
    },
    {
      title: "Phone Number",
      key: "phoneNumber",
      dataIndex: ["recipient", 'phoneNumber'],
      ellipsis: true,
    },
    {
      title: "App",
      key: "AppId",
      dataIndex: ["app", 'name'],
      ellipsis: true,
    },
    {
      title: "Template",
      key: "messageTemplate",
      dataIndex: ["messageTemplate", 'name'],
      ellipsis: true,
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
        loading={isPending}
        size="small"
        columns={columns}
        dataSource={data?.rows ?? []}
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
});

export default LogTable;