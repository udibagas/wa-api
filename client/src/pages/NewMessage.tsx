import React, { useEffect, useState } from "react";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import PageHeader from "../components/PageHeader";
import { Button, Divider, Form, message, Select, Upload } from "antd";
import { AppType, GroupType, RecipientType, TemplateType } from "../types";
import axiosInstance from "../utils/axiosInstance";
import WhatsAppChatBubble from "../components/WhatsAppChatBubble";
import { Modal } from "antd";
import TextArea from "antd/es/input/TextArea";

type MessageType = {
  type: string;
  AppId: number;
  MessageTemplateId: number;
  GroupId: number;
};

const NewMessage: React.FC = () => {
  const [apps, setApps] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [groups, setGroups] = useState([]);
  const [recipients, setRecipients] = useState<RecipientType[]>([]);
  const [body, setBody] = useState('')
  const [imageUrl, setImageUrl] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');

  const [form] = Form.useForm();
  const templateId = Form.useWatch('MessageTemplateId', form);
  const AppId = Form.useWatch('AppId', form);

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

    axiosInstance.get("/recipients", { params: { paginated: false } }).then((response) => {
      setRecipients(response.data);
    });

    return () => {
      setApps([]);
      setTemplates([]);
      setGroups([]);
    };
  }, [])

  function sendMessage(values: MessageType) {
    if (!values) return;

    const payload = {
      ...values,
      type: imageUrl ? 'image' : 'text',
      message: body,
      caption: body,
      filePath,
      fileType
    };

    axiosInstance.post('sendTemplate', payload)
      .then(res => {
        message.success(res.data.message);
      }).catch(err => {
        message.error(err.response.data.message);
      });
  }

  function handleSend(values: object) {
    Modal.confirm({
      title: 'Confirmation',
      content: 'Are you sure you want to send this message?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => sendMessage(values as MessageType),
      onCancel() { },
    });
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  return (
    <>
      <PageHeader title="New Message" subtitle="Create new message" />

      <div style={{ display: "flex", gap: 20 }}>
        <Form
          variant="filled"
          form={form}
          labelCol={{ span: 8 }}
          style={{ width: 500 }}
          onFinish={handleSend}
        >
          <Form.Item
            name="AppId"
            label="App"
            rules={[{ required: true, message: 'Mohon pilih App' }]}
          >
            <Select
              placeholder="Select App"
              allowClear
              options={apps.map((a: AppType) => ({ label: a.name, value: a.id }))}
              onChange={(appId: number) => {
                console.log(appId)
                form.setFieldValue('MessageTemplateId', undefined);
              }}
            >
            </Select>
          </Form.Item>

          <Form.Item
            name="MessageTemplateId"
            label="Message Template"
            rules={[{ required: true, message: 'Mohon pilih template' }]}
          >
            <Select
              placeholder="Select template"
              allowClear
              options={
                templates
                  .filter((t: TemplateType) => t.appId === AppId)
                  .map((t: TemplateType) => ({ label: t.name, value: t.id }))
              }
            >
            </Select>
          </Form.Item>

          <Form.Item
            name="groups"
            label="Group"
          >
            <Select
              mode="multiple"
              placeholder="Select group(s)"
              allowClear
              options={groups.map((group: GroupType) => ({ label: group.name, value: group.id }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
            </Select>
          </Form.Item>

          <Divider plain>Or</Divider>

          <Form.Item
            name="recipients"
            label="Recipients"
          >
            <Select
              mode="multiple"
              placeholder="Enter recipient name/phone number"
              allowClear
              options={recipients.map((t) => ({ label: `${t.name} <${t.phoneNumber}>`, value: t.id }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
            </Select>
          </Form.Item>

          <TextArea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Message body"
            style={{ marginBottom: 20 }}
            maxLength={4096}
            showCount
          />

          <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              maxCount={1}
              name="image"
              listType="picture"
              action={axiosInstance.defaults.baseURL + '/upload'}
              accept="image/*"
              withCredentials
              onChange={({ file }) => {
                if (file.status === 'done') {
                  console.log(file.response.file)
                  setFilePath(file.response.file.path);
                  setFileType(file.response.file.mimetype);
                  setImageUrl(file.response.url);
                }
              }}
              onRemove={(file) => {
                axiosInstance.post('/delete-image', { path: file.response.file.path })
                setFilePath('');
                setFileType('');
                setImageUrl('');
              }}
            >
              <Button icon={<UploadOutlined />}>Select image</Button>
            </Upload>
          </Form.Item>

          <Form.Item label={null}>
            <Button block type="primary" htmlType="submit" icon={<SendOutlined />}>
              SEND
            </Button>
          </Form.Item>
        </Form>

        <WhatsAppChatBubble sender="PELINDO" message={body} imageUrl={imageUrl} />
      </div >
    </>
  );
}

export default NewMessage;