import React, { useState } from 'react';
import {
  BarsOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SettingFilled,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import '../css/App.css';
import { Link, Outlet, useLocation } from 'react-router';

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
  getItem(<Link to="/">Dashboard</Link>, 'home', <DashboardOutlined />),
  getItem(<Link to="/recipients">Recipients</Link>, 'recipients', <TeamOutlined />),
  getItem(<Link to="/apps">Apps</Link>, 'apps', <SettingFilled />),
  getItem(<Link to="/templates">Templates</Link>, 'templates', <FileTextOutlined />),
  getItem(<Link to="/logs">Logs</Link>, 'logs', <BarsOutlined />),
  getItem(<Link to="/users">Users</Link>, 'users', <UserOutlined />),
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1] || 'home';


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" >
          A
        </div>
        <Menu theme="dark" defaultSelectedKeys={[selectedKey]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 20px', background: colorBgContainer, fontWeight: 'bold', fontSize: '1.5rem' }}>
          WhatsApp Gateway
        </Header>

        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 'calc(100vh - 165px)',
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