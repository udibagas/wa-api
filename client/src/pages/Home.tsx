import React, { useEffect, useState } from "react";
import { Card, Statistic } from "antd";
import PageHeader from "../components/PageHeader";
import {
  BarChartOutlined,
  // BlockOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  // FileTextOutlined,
  // ReloadOutlined,
  WhatsAppOutlined,
  // TeamOutlined
} from "@ant-design/icons";
import LogTable from "../components/LogTable";
import axiosInstance from "../utils/axiosInstance";

const Home: React.FC = () => {
  const [data, setData] = useState({
    messageCount: 0,
    successMessageCount: 0,
    failedMessageCount: 0,
    recipientCount: 0,
    successRate: 0,
  });

  useEffect(() => {
    let ignore = false;

    const interval = setInterval(() => {
      axiosInstance.get('/stats').then(({ data }) => {
        if (ignore) return;
        setData(data);
      })
    }, 3000);

    return () => {
      ignore = true;
      clearInterval(interval);
    }
  }, []);

  const statictics = [
    { title: 'Success Rate', value: data.successRate, color: '#1890ff', prefix: <BarChartOutlined />, suffix: '%', precision: 2 },
    { title: 'Total Messages', value: data.messageCount, color: '#faad14', prefix: <WhatsAppOutlined /> },
    { title: 'Successful Messages', value: data.successMessageCount, color: '#3f8600', prefix: <CheckSquareOutlined /> },
    { title: 'Failed Messages', value: data.failedMessageCount, color: '#cf1322', prefix: <CloseSquareOutlined /> },
    // { title: 'Total Recipients', value: data.recipientCount, color: '#1890ff', prefix: <TeamOutlined /> },
    // { title: 'Total Groups', value: totalRecipients, color: '#1890ff', prefix: <BlockOutlined /> },
    // { title: 'Total Templates', value: totalRecipients, color: '#1890ff', prefix: <FileTextOutlined /> },
  ];

  return (
    <>
      <PageHeader
        title="Dahsboard"
        subtitle="Your stats at a glance"
      >
        {/* <Button type="primary" icon={<ReloadOutlined />} >Refresh</Button> */}
      </PageHeader>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '2rem'
      }}>
        {statictics.map((stat, index) => (
          <Card key={index} bordered={true} style={{ flex: 1, minWidth: 250 }}>
            <Statistic
              title={stat.title}
              value={stat.value}
              valueStyle={{ color: stat.color }}
              prefix={stat.prefix}
              suffix={stat.suffix}
              precision={stat.precision ?? 0}
            />
          </Card>
        ))}
      </div>

      <h2>Latest Logs</h2>
      <LogTable />

    </>
  );
};

export default Home;