import { Tooltip } from "antd";
import moment from "moment";
import {
  CheckCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import React from "react";
import { Message } from "../types";
import { markupTextToWhatsApp } from "../utils/markupTextToWhatsApp";

const ChatMessage: React.FC<{ message: Message }> = React.memo(({ message }) => {
  return (
    <div className={`chat-message ${message.from == '6285138388850' ? 'me' : 'them'}`}>
      <div style={{ color: '#888', fontSize: '0.9em' }}>
        <Tooltip title={message.status}>
          {message.status === 'pending' && <ExclamationCircleOutlined />}
          {message.status === 'sent' && <CheckCircleOutlined />}
          {message.status === 'delivered' && <CheckCircleTwoTone />}
          {message.status === 'failed' && <CloseCircleOutlined style={{ color: 'red' }} />}
        </Tooltip> &nbsp;
        <Tooltip title={moment(message.createdAt).format('LLL')}>
          {moment(message.createdAt).fromNow()}
        </Tooltip>

      </div>
      <div dangerouslySetInnerHTML={{ __html: markupTextToWhatsApp(message.message) }}></div>
    </div>
  )
})

export default ChatMessage;