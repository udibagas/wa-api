import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import { HomeOutlined } from "@ant-design/icons";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="primary"
            onClick={() => navigate('/')}
            icon={<HomeOutlined />}
          >
            Back Home
          </Button>
        }
      />
    </div>
  )


};

export default NotFound;