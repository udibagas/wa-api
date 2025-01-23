import React, { useState } from 'react';
import {
  DashboardOutlined,
  SettingFilled,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import '../App.css';
import { Link, Outlet } from 'react-router';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link to="/">Dashboard</Link>, '1', <DashboardOutlined />),
  getItem(<Link to="/recipients">Recipients</Link>, '2', <TeamOutlined />),
  getItem(<Link to="/apps">Apps</Link>, '3', <SettingFilled />),
  getItem(<Link to="/templates">Templates</Link>, '4', <TeamOutlined />),
  getItem(<Link to="/logs">Logs</Link>, '5', <UserOutlined />),
  getItem(<Link to="/users">Users</Link>, '6', <UserOutlined />),
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" >
          A
        </div>
        <Menu onClick={onClick} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 20px', background: colorBgContainer, fontWeight: 'bold', fontSize: '1.5rem' }}>
          WhatsApp Gateway
        </Header>

        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
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