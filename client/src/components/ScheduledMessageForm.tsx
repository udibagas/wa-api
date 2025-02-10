import React from "react";
import { Modal, Form, Input } from "antd";
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";
import { CustomFormProps, FileType, ScheduledMessageType } from "../types";
import TextArea from "antd/es/input/TextArea";
import WhatsAppChatBubble from "./WhatsAppChatBubble";
import RecipientSelectOption from "./RecipientSelectOption";

const TemplateForm: React.FC<CustomFormProps<ScheduledMessageType>> = ({ visible, isEditing, onCancel, onOk, errors, form }) => {
  const message = Form.useWatch('message', form);

  return (
    <Modal
      width={800}
      title={isEditing ? "Edit Schedule Message" : "Create New Schedule Message"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <CancelButton label="Cancel" onCancel={onCancel} key='back' />,
        <SaveButton label={isEditing ? "Update" : "Add"} key='submit' />,
      ]}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
        <Form
          style={{ width: 400 }}
          variant="filled"
          form={form}
          id="form"
          onFinish={onOk}
          requiredMark={false}
          labelCol={{ span: 7 }}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.join(", ")}
          >
            <Input placeholder="Message name" />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            validateStatus={errors.message ? "error" : ""}
            help={errors.message?.join(", ")}
          >
            <TextArea
              placeholder="Type your message here"
              autoSize={{ minRows: 8, maxRows: 10 }}
              maxLength={4096}
              showCount />
          </Form.Item>

          <Form.Item
            label="Recipients"
            name="recipients"
            validateStatus={errors.recipient ? "error" : ""}
            help={errors.recipient?.join(", ")}
          >
            <RecipientSelectOption />
          </Form.Item>

          <Form.Item
            label="Time"
            name="time"
            validateStatus={errors.time ? "error" : ""}
            help={errors.time?.join(", ")}
          >
            <Input placeholder="m H D M d Y" />
            <div>
              m = minute <br />
              H = hour <br />
              D = date <br />
              M = month <br />
              d = day of week <br />
              Y = year
            </div>
          </Form.Item>
        </Form>

        <WhatsAppChatBubble message={message} file={{} as FileType} />
      </div>

    </Modal>
  );
};

export default TemplateForm;