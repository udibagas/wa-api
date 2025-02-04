import React from "react";
import { Typography, Space } from "antd";

const { Title, Text } = Typography;

type PageHeaderProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <Space align="center" style={{ justifyContent: 'space-between', width: '100%', marginBottom: '3rem' }}>
      <div>
        <Title level={2} style={{ marginBottom: 0 }}>{title}</Title>
        <Text type="secondary">{subtitle}</Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: '1em' }}>
        {children}
      </div>
    </Space>
  );
};

export default PageHeader;