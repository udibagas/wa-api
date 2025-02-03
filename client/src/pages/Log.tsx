import React from "react";
import PageHeader from "../components/PageHeader";
import { Button, Descriptions, Modal, Table } from "antd";
import { LogType, StatusType } from "../types";
import useCrud from "../hooks/useCrud";
import { ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import StatusTag from "../components/StatusTag";

const Log: React.FC = () => {

  const { data, isLoading, fetchData } = useCrud<LogType>("/logs", true);

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
      title: "Status",
      key: "status",
      width: 150,
      align: "center" as const,
      render: (_: string, record: LogType) => <StatusTag status={record.status as StatusType} />
    },
  ];

  function showDetails(record: LogType) {
    Modal.info({
      title: "Log Details",
      width: '600px',
      content: (
        <Descriptions
          column={1}
          size="small"
          bordered
        >
          <Descriptions.Item label="Time">
            {moment(record.createdAt).format("DD-MMM-YYYY HH:mm:ss")}
          </Descriptions.Item>

          <Descriptions.Item label="App">
            {record.app.name}
          </Descriptions.Item>

          <Descriptions.Item label="Recipient">
            {record.recipient.name} - {record.recipient.phoneNumber}
          </Descriptions.Item>

          <Descriptions.Item label="Template">
            {record.messageTemplate.name}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <StatusTag status={record.status as StatusType} />
          </Descriptions.Item>

          <Descriptions.Item label="Response">
            <pre style={{
              whiteSpace: "pre-wrap",
              background: "black",
              color: 'lightgreen',
              padding: "20px",
              borderRadius: "5px",
            }}>
              {JSON.stringify(record.response, null, 2)}
            </pre>
          </Descriptions.Item>
        </Descriptions>
      ),
    })
  }

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
        // pagination={{
        // current: currentPage,
        // total: total,
        // showSizeChanger: true,
        // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        // }}
        onRow={(record: LogType) => {
          return {
            onClick: () => showDetails(record),
          };
        }}
      />

    </>
  );
};

export default Log;