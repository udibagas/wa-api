import { Menu, MenuProps } from "antd";
import React from "react";
import { Link, useLocation } from "react-router";
import {
  BarChartOutlined,
  BarsOutlined,
  BlockOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingFilled,
  TeamOutlined,
  UserOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';

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
  getItem(<Link to="/">Dashboard</Link>, 'home', <BarChartOutlined />),
  getItem(<Link to="/new-message">New Message</Link>, 'new-message', <WhatsAppOutlined />),
  getItem(<Link to="/scheduled-message">Scheduled Message</Link>, 'scheduled-message', <CalendarOutlined />),
  getItem(<Link to="/groups">Groups</Link>, 'groups', <BlockOutlined />),
  getItem(<Link to="/recipients">Recipients</Link>, 'recipients', <TeamOutlined />),
  getItem(<Link to="/apps">Apps</Link>, 'apps', <SettingFilled />),
  getItem(<Link to="/templates">Templates</Link>, 'templates', <FileTextOutlined />),
  getItem(<Link to="/logs">Logs</Link>, 'logs', <BarsOutlined />),
  getItem(<Link to="/users">Users</Link>, 'users', <UserOutlined />),
];

const NavMenu: React.FC = () => {
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1] || 'home';

  return (
    <Menu theme="dark" defaultSelectedKeys={[selectedKey]} mode="inline" items={items} />
  );
};

export default NavMenu;
