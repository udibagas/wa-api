import React from "react";
import { StatusType } from "../types";
import { Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const colors: { [key in StatusType]: string } = {
  success: "green",
  error: "red",
  failed: "red",
  warning: "orange",
  info: "blue",
}

type StatusTagProps = {
  status: StatusType;
};

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {

  return (
    <Tag
      bordered={false}
      color={colors[status]}
      icon={status === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
      style={{ textAlign: "center" }}
    >
      {status.toUpperCase()}
    </Tag>
  )

};

export default StatusTag;