import React, { useContext, useState } from 'react';
import {
  BarsOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingFilled,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
const { Text } = Typography;
import type { MenuProps } from 'antd';
import { Dropdown, Layout, Menu, Modal, Space, theme, Typography } from 'antd';
import '../css/App.css';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import axiosInstance from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';

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
  getItem(<Link to="/groups">Groups</Link>, 'groups', <ProfileOutlined />),
  getItem(<Link to="/recipients">Recipients</Link>, 'recipients', <TeamOutlined />),
  getItem(<Link to="/apps">Apps</Link>, 'apps', <SettingFilled />),
  getItem(<Link to="/templates">Templates</Link>, 'templates', <FileTextOutlined />),
  getItem(<Link to="/logs">Logs</Link>, 'logs', <BarsOutlined />),
  getItem(<Link to="/users">Users</Link>, 'users', <UserOutlined />),
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1] || 'home';

  function logout() {
    Modal.confirm({
      title: 'Confirmation',
      content: 'Are you sure you want to logout?',
      icon: <LogoutOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        axiosInstance.post('/logout').then(() => {
          navigate('/login');
        });
      },
    })

  }

  const menuItems: MenuProps['items'] = [
    { key: "profile", label: 'Profile', icon: <UserOutlined /> },
    { key: "logout", label: 'Logout', icon: <LogoutOutlined />, onClick: logout },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" >
          {user?.name[0]}
        </div>
        <Menu theme="dark" defaultSelectedKeys={[selectedKey]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 20px', background: '#fff', fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>WhatsApp Gateway</div>
          <Dropdown menu={{ items: menuItems }} placement="bottom" arrow>
            <Space>
              <Text strong>Welcome, {user?.name}!</Text>
            </Space>
          </Dropdown>
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