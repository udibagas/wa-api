import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type AddButtonProps = {
  label: string;
  onClick: () => void;
};

const AddButton: React.FC<AddButtonProps> = ({ label, onClick }) => {
  return (
    <Button type="primary" icon={<PlusOutlined />} onClick={onClick}>
      {label || "Add"}
    </Button>
  );
};

export default AddButton;
