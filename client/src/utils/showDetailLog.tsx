import { Descriptions, Modal } from "antd";
import { LogType, StatusType } from "../types";
import moment from "moment";
import StatusTag from "../components/StatusTag";

export function showDetailLog(record: LogType) {
  Modal.info({
    title: "Log Details",
    width: '600px',
    content: (
      <Descriptions
        column={1}
        size="small"
        bordered
      >
        <Descriptions.Item label="Time">
          {moment(record.createdAt).format("DD-MMM-YYYY HH:mm:ss")}
        </Descriptions.Item>

        <Descriptions.Item label="App">
          {record.app.name}
        </Descriptions.Item>

        <Descriptions.Item label="Recipient">
          {record.recipient.name} - {record.recipient.phoneNumber}
        </Descriptions.Item>

        <Descriptions.Item label="Template">
          {record.messageTemplate.name}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <StatusTag status={record.status as StatusType} />
        </Descriptions.Item>

        <Descriptions.Item label="Response">
          <pre style={{
            whiteSpace: "pre-wrap",
            background: "black",
            color: 'lightgreen',
            padding: "20px",
            borderRadius: "5px",
          }}>
            {JSON.stringify(record.response, null, 2)}
          </pre>
        </Descriptions.Item>
      </Descriptions>
    ),
  })
}