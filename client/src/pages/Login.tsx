import React from "react";
import { Form, Input, Button, message, FormProps } from "antd";
import styles from '../css/Login.module.css'; // Import the CSS file for custom styles
import { useNavigate } from "react-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { AxiosError } from "axios";
import { AxiosErrorResponseType } from "../types";
import client from "../api/client";

type LoginValues = {
  email?: string;
  password?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const onFinish: FormProps<LoginValues>['onFinish'] = async (values) => {
    console.log("Success:", values);
    try {
      await client.post("/auth/login", values);
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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}>
        <div style={{
          padding: '2rem',
          borderRadius: '8px 0 0 8px',
          backgroundColor: 'white',
        }}>
          <h1>Login</h1>
          <Form
            style={{ width: 300 }}
            variant="filled"
            size="large"
            layout="vertical"
            name="login"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button
                block
                htmlType="submit"
                style={{ backgroundColor: '#0C74B6', color: 'white', border: 'none' }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div style={{
          textAlign: 'center',
          width: 300,
          background: '#0C74B6',
          color: 'white',
          padding: '1rem',
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          borderRadius: '0 8px 8px 0',
        }}>
          <div>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: 0
            }}>BlastIt!</div>
            <div style={{ color: '#ddd' }}>Send once, reach all!</div>
          </div>
          <small>© {new Date().getFullYear()}</small>

        </div>
      </div>
    </div>
  );
};

export default Login;