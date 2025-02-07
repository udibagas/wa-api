import React, { useState } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Layout, Modal, Space, theme, Typography } from 'antd';
import { Outlet, useLoaderData, useNavigate } from 'react-router';
import NavMenu from '../components/NavMenu';
import '../css/App.css';
import client from '../api/client';

const { Text } = Typography;
const { Header, Content, Footer, Sider } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useLoaderData()

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function logout() {
    Modal.confirm({
      title: 'Confirmation',
      content: 'Are you sure you want to logout?',
      icon: <LogoutOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        client.post('/logout').then(() => {
          navigate('/login');
        });
      },
    })
  }

  const menuItems: MenuProps['items'] = [
    { key: "profile", label: 'Profile', icon: <UserOutlined />, onClick: () => navigate('/profile') },
    { key: "logout", label: 'Logout', icon: <LogoutOutlined />, onClick: logout },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo">
          {user?.name[0]}
        </div>

        <NavMenu />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 20px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 24, color: '#0C74B6', fontWeight: 'bold' }}>BlastIt!</div>
          <Dropdown menu={{ items: menuItems }} placement="bottom" arrow>
            <Space>
              <Avatar style={{ backgroundColor: '#87d068' }} size={25} icon={<UserOutlined />} />
              <Text strong>Welcome, {user.name}!</Text>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              height: 'calc(100vh - 165px)',
              overflow: 'auto',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          WhatsApp Gateway ©{new Date().getFullYear()} Developed by MEKAR
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;