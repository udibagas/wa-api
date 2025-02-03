import React from "react";
import PageHeader from "../components/PageHeader";
import { Button } from "antd";
import { LogType } from "../types";
import useCrud from "../hooks/useCrud";
import { ReloadOutlined } from "@ant-design/icons";
import LogTable from "../components/LogTable";

const Log: React.FC = () => {

  const { fetchData } = useCrud<LogType>("/logs");

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

      <LogTable />
    </>
  );
};

export default Log;