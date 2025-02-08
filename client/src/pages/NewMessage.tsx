import React, { useEffect, useState } from "react";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import PageHeader from "../components/PageHeader";
import { Button, Form, message, Select, Upload } from "antd";
import { FileType, GroupType, MessageType, RecipientType, TemplateType } from "../types";
import WhatsAppChatBubble from "../components/WhatsAppChatBubble";
import { Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useQuery } from "@tanstack/react-query";
import client from "../api/client";
import apolloClient from "../apollo/client";
import { GET_MASTER_DATA } from "../graphql/queries";

interface Data {
  templates: TemplateType[];
  groups: GroupType[];
  recipients: RecipientType[];
}

const NewMessage: React.FC = () => {
  const [body, setBody] = useState<string>('')
  const [file, setFile] = useState<FileType>({} as FileType);
  const [form] = Form.useForm();
  const templateId = Form.useWatch('MessageTemplateId', form);

  const { data } = useQuery({
    queryKey: ['masterData'],
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_MASTER_DATA })
      const { templates, groups, recipients }: Data = data;
      return { templates, groups, recipients };
    }
  })

  const { templates, groups, recipients } = data ?? { templates: [], groups: [], recipients: [] };

  useEffect(() => {
    if (templateId) {
      const m = templates.find((t) => t.id === templateId)
      setBody(m?.body ?? '');
    }
  }, [templateId, templates]);

  function sendMessage(values: MessageType) {
    if (!values) return;

    console.log(values);

    const { groups = [], recipients = [] } = values;

    if (!groups.length && !recipients.length) {
      message.error('Mohon pilih group atau penerima');
      return;
    }

    let type = 'text';

    if (file?.mimetype?.includes('image')) {
      type = 'image';
    }

    if (file?.mimetype?.includes('application')) {
      type = 'document';
    }

    const payload = {
      ...values,
      type,
      message: body,
      caption: body,
      file
    };

    client.post('sendTemplate', payload)
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
      return e[0].response.file;
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
            name="MessageTemplateId"
            label="Message Template"
            rules={[{ required: true, message: 'Mohon pilih template' }]}
          >
            <Select
              placeholder="Select template"
              allowClear
              options={templates.map((t) => ({ label: t.name, value: t.id }))}
            >
            </Select>
          </Form.Item>

          <Form.Item label="Body">
            <TextArea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Message body"
              autoSize={{ minRows: 3, maxRows: 10 }}
              maxLength={4096}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="groups"
            label="Group"
          >
            <Select
              mode="multiple"
              placeholder="Select group(s)"
              allowClear
              options={groups.map((group) => ({ label: group.name, value: group.id }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
            </Select>
          </Form.Item>

          <Form.Item
            name="recipients"
            label="Recipients"
          >
            <Select
              mode="multiple"
              placeholder="Enter recipient name/phone number"
              allowClear
              options={recipients.map((t) => ({ label: `${t.name} - ${t.phoneNumber}`, value: t.id }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              optionRender={({ label }) => {
                const [name, phoneNumber] = (label as string)?.split(' - ') ?? [];
                return (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{name}</span>
                    <i style={{ color: '#999' }}>+{phoneNumber}</i>
                  </div>
                );
              }}
            >
            </Select>
          </Form.Item>

          <Form.Item name="file" label="File" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              maxCount={1}
              name="file"
              listType="picture"
              action={client.defaults.baseURL + '/upload'}
              accept="image/*, application/*"
              withCredentials
              onChange={({ file }) => {
                if (file.status === 'done') {
                  setFile(file.response.file);
                }
              }}
              onRemove={(file) => {
                client.post('/delete-file', { path: file.response.file.path })
                setFile({} as FileType);
              }}
            >
              <Button icon={<UploadOutlined />}>Select file</Button>
            </Upload>
          </Form.Item>

          <Form.Item label={null}>
            <Button block type="primary" htmlType="submit" icon={<SendOutlined />}>
              SEND
            </Button>
          </Form.Item>
        </Form>

        <WhatsAppChatBubble message={body} file={file} />
      </div >
    </>
  );
}

export default NewMessage;