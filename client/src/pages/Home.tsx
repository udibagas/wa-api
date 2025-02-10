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
import client from "../api/client";

const Home: React.FC = () => {
  const [data, setData] = useState({
    messageCount: 0,
    successMessageCount: 0,
    failedMessageCount: 0,
    recipientCount: 0,
    successRate: 0,
  });

  console.log('Render ulang Home');

  useEffect(() => {
    let ignore = false;

    const getData = (): Promise<void> => client.get('/stats').then(({ data }) => {
      if (ignore) return;
      setData(data);
    })

    getData();

    const interval = setInterval(getData, 3000);

    return () => {
      ignore = true;
      clearInterval(interval);
    }
  }, []);

  const successRateColors = {
    0: '#cf1322',
    25: '#cf1322',
    50: '#faad14',
    75: '#3f8600',
    100: '#1890ff',
  }

  function getSuccessRateColor(rate: number): string {
    if (rate < 25) return successRateColors[0];
    if (rate < 50) return successRateColors[25];
    if (rate < 75) return successRateColors[50];
    if (rate < 100) return successRateColors[75];
    return successRateColors[100];
  }

  const statictics = [
    { title: 'Success Rate', value: data.successRate, color: getSuccessRateColor(data.successRate), prefix: <BarChartOutlined />, suffix: '%', precision: 2 },
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
          <Card key={index} bordered={true} style={{ flex: 1, minWidth: 200 }}>
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