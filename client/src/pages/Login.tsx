import React from "react";
import { Form, Input, Button, Checkbox, Card } from "antd";
import '../css/Login.css'; // Import the CSS file for custom styles

const Login: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-container">
      <Card title={<div style={{ textAlign: 'center', fontSize: '1.5rem' }}>WhatsApp Gateway</div>} className="login-card">
        <Form
          layout="vertical"
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item style={{ marginTop: 50 }}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;