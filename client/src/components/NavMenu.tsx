import { Menu, MenuProps } from "antd";
import React, { useEffect, useState } from "react";
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
  // getItem(<Link to="/chat">Chat</Link>, 'chat', <WhatsAppOutlined />),
  getItem(<Link to="/scheduled-message">Scheduled Message</Link>, 'scheduled-message', <CalendarOutlined />),
  getItem(<Link to="/groups">Groups</Link>, 'groups', <BlockOutlined />),
  getItem(<Link to="/contacts">Contacts</Link>, 'contacts', <TeamOutlined />),
  getItem(<Link to="/apps">Apps</Link>, 'apps', <SettingFilled />),
  getItem(<Link to="/templates">Templates</Link>, 'templates', <FileTextOutlined />),
  getItem(<Link to="/logs">Logs</Link>, 'logs', <BarsOutlined />),
  getItem(<Link to="/users">Users</Link>, 'users', <UserOutlined />),
  getItem(<Link to="/settings">Settings</Link>, 'settings', <SettingFilled />),
];

const NavMenu: React.FC = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKeys] = useState(location.pathname.split('/')[1] || 'home');

  useEffect(() => {
    setSelectedKeys(location.pathname.split('/')[1] || 'home');
  }, [location]);

  return (
    <Menu
      theme="dark"
      selectedKeys={[selectedKey]}
      mode="inline"
      items={items}
    />
  );
};

export default NavMenu;
