import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Space } from 'antd';

const Loading: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Space size="middle">
        <LoadingOutlined />
        Loading...
      </Space>
    </div>
  );
}

export default Loading;