import React from "react";
import { Form, Input, Button, Card, message, FormProps } from "antd";
import styles from '../css/Login.module.css'; // Import the CSS file for custom styles
import { useNavigate } from "react-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { AxiosError } from "axios";
import { AxiosErrorResponseType } from "../types";
import axiosInstance from "../utils/axiosInstance";

type LoginValues = {
  email?: string;
  password?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const onFinish: FormProps<LoginValues>['onFinish'] = async (values) => {
    console.log("Success:", values);
    try {
      await axiosInstance.post("/login", values);
      message.success("Login successful!");
      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError;
      const axiosErrorResponse = axiosError.response
        ?.data as AxiosErrorResponseType;

      message.error(axiosErrorResponse.message ?? axiosError.message);
    }
  };

  const onFinishFailed: FormProps<LoginValues>['onFinishFailed'] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={styles.loginContainer}>
      <Card title={<div style={{ textAlign: 'center', fontSize: '1.5rem' }}>WhatsApp Gateway</div>} className={styles.loginCard}>
        <Form
          variant="filled"
          size="large"
          layout="vertical"
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;