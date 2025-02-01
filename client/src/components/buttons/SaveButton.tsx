import React from "react";
import { Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";

type SaveButtonProps = {
  label: string;
  form: string;
};

const SaveButton: React.FC<SaveButtonProps> = ({ label, form }) => {
  return (
    <Button icon={<SaveOutlined />} type="primary" form={form} htmlType="submit">
      {label || 'Save'}
    </Button>
  );
};

export default SaveButton;
