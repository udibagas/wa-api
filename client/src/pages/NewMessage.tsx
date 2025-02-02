import React, { useEffect, useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import PageHeader from "../components/PageHeader";
import { Button, Form, message, Select } from "antd";
import { AppType, GroupType, TemplateType } from "../types";
import axiosInstance from "../utils/axiosInstance";
import WhatsAppChatBubble from "../components/WhatsAppChatBubble";

const NewMessage: React.FC = () => {
  const [apps, setApps] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [groups, setGroups] = useState([]);
  const [form] = Form.useForm();
  const templateId = Form.useWatch('MessageTemplateId', form);
  const [body, setBody] = useState('')

  useEffect(() => {
    if (templateId) {
      const m = templates.find((t: TemplateType) => t.id === templateId)
      setBody(m ? (m as TemplateType).body : '');
    }
  }, [templateId, templates]);

  useEffect(() => {
    axiosInstance.get("/message-templates").then((response) => {
      setTemplates(response.data);
    });

    axiosInstance.get("/groups").then((response) => {
      setGroups(response.data);
    });

    axiosInstance.get("/apps").then((response) => {
      setApps(response.data);
    });

    return () => {
      setApps([]);
      setTemplates([]);
      setGroups([]);
    };
  }, [])

  function handleSend(values: object) {
    axiosInstance.post('sendTemplate', values)
      .then(res => {
        message.success(res.data.message);
      }).catch(err => {
        message.error(err.response.data.message);
      });
  }

  return (
    <>
      <PageHeader
        title="New Message"
        subtitle="Create new message"
      >
      </PageHeader>

      <div style={{ display: "flex", gap: 20 }}>
        <Form
          form={form}
          labelCol={{ span: 8 }}
          style={{ width: 450 }}
          onFinish={handleSend}
        >

          <Form.Item name="AppId" label="App" rules={[{ required: true }]}>
            <Select
              placeholder="Select App"
              allowClear
              options={apps.map((a: AppType) => ({ label: a.name, value: a.id }))}
            >
            </Select>
          </Form.Item>

          <Form.Item name="MessageTemplateId" label="Message Template" rules={[{ required: true }]}>
            <Select
              placeholder="Select template"
              allowClear
              options={templates.map((t: TemplateType) => ({ label: t.name, value: t.id }))}
            >
            </Select>
          </Form.Item>

          <Form.Item name="GroupId" label="Group" rules={[{ required: true }]}>
            <Select
              placeholder="Select group"
              allowClear
              options={groups.map((g: GroupType) => ({ label: g.name, value: g.id }))}
            >
            </Select>
          </Form.Item>

          <Form.Item label={null}>
            <Button block type="primary" htmlType="submit" icon={<SendOutlined />}>
              SEND
            </Button>
          </Form.Item>
        </Form>

        <WhatsAppChatBubble sender="PELINDO" message={body} />
      </div>
    </>
  );
}

export default NewMessage;