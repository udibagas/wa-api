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
  draft: "default",
  submitted: "orange",
  "in-review": "orange",
  rejected: "red",
  approved: "success",
}

const icons: { [key in StatusType]: React.ReactElement } = {
  success: <CheckCircleOutlined />,
  error: <CloseCircleOutlined />,
  failed: <CloseCircleOutlined />,
  warning: <CloseCircleOutlined />,
  info: <CloseCircleOutlined />,
  draft: <CheckCircleOutlined />,
  submitted: <CheckCircleOutlined />,
  "in-review": <CheckCircleOutlined />,
  rejected: <CloseCircleOutlined />,
  approved: <CheckCircleOutlined />,
}

type StatusTagProps = {
  status: StatusType;
};

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {

  return (
    <Tag
      bordered={false}
      color={colors[status]}
      icon={icons[status]}
      style={{ textAlign: "center" }}
    >
      {status.toUpperCase()}
    </Tag>
  )

};

export default StatusTag;