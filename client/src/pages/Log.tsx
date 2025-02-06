import React, { useEffect, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import { Button, Input, Popconfirm, Radio, Space, Table } from "antd";
import { LogType, PaginatedData, StatusType } from "../types";
import { CloseCircleOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import StatusTag from "../components/StatusTag";
import { showDetailLog } from "../utils/showDetailLog";
import { CheckCircleOutlined } from "@ant-design/icons";
import useForm from "../hooks/useForm";
import client from "../api/client";

const Log: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState({ status: 'all' });
  const { useFetch, refreshData } = useForm<LogType>("/logs", "logs");

  const params = useMemo(
    () => ({ page: currentPage, limit: pageSize, search, ...filter }),
    [currentPage, pageSize, search, filter]
  );

  const { data, isPending } = useFetch<PaginatedData<LogType>>(params);

  useEffect(() => {
    refreshData();
  }, [params]);

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
            client.delete("/logs").then(() => refreshData());
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
      </PageHeader >

      <Table
        loading={isPending}
        size="small"
        columns={columns}
        dataSource={data?.rows ?? []}
        rowKey="id"
        pagination={{
          size: "small",
          current: currentPage,
          total: data?.total,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
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