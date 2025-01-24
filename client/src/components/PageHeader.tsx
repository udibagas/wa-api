import React from "react";
import { Typography, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

type PageHeaderProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick: () => void;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, buttonText, onButtonClick }) => {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space align="center" style={{ justifyContent: 'space-between', width: '100%', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>{title}</Title>
          <Text type="secondary">{subtitle}</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={onButtonClick}>
          {buttonText}
        </Button>
      </Space>
    </Space>
  );
};

export default PageHeader;