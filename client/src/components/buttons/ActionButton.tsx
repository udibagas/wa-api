import React from "react";
import { Dropdown, MenuProps } from "antd";
import { EditOutlined, DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";

type ActionButtonProps = {
  onEdit: () => void;
  onDelete: () => void;
};

const ActionButton: React.FC<ActionButtonProps> = ({ onEdit, onDelete }) => {
  const items: MenuProps['items'] = [
    { key: "edit", label: 'Edit', icon: <EditOutlined />, onClick: onEdit },
    { key: "delete", label: 'Delete', icon: <DeleteOutlined />, onClick: onDelete }
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomCenter" arrow>
      <EllipsisOutlined />
    </Dropdown>

  )
};

export default ActionButton;
