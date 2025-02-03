import React from "react";
import { Descriptions, Modal, Table, Tag } from "antd";
import { LogType, StatusType } from "../types";
import useCrud from "../hooks/useCrud";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const colors: { [key in 'success' | 'error' | 'warning' | 'info']: string } = {
  success: "green",
  error: "red",
  warning: "orange",
  info: "blue",
}

const LogTable: React.FC = () => {

  const { data, isLoading } = useCrud<LogType>("/logs");

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
      render: (_: string, record: LogType) => {
        const status = record.status as StatusType;
        return (
          <Tag
            bordered={false}
            color={colors[status]}
            icon={status === 'error' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
          >
            {status}
          </Tag>
        )
      }
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
            onClick: () => {
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
                      <Tag
                        bordered={false}
                        color={colors[record.status]}
                        icon={record.status === 'error' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                      >
                        {record.status}
                      </Tag>
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
            },
          };
        }}
      />
    </>
  );
};

export default LogTable;