import React from "react";
import { Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

type ActionButtonProps = {
  onEdit: () => void;
  onDelete: () => void;
};

const ActionButton: React.FC<ActionButtonProps> = ({ onEdit, onDelete }) => {
  return (
    <>
      <Button type="link" icon={<EditOutlined />} onClick={onEdit} />
      <Button type="link" icon={<DeleteOutlined />} danger onClick={onDelete} />
    </>
  );
};

export default ActionButton;
