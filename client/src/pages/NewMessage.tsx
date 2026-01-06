import React, { useEffect, useState } from "react";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import PageHeader from "../components/PageHeader";
import { Button, Form, message, Result, Select, Upload } from "antd";
import { FileType, MasterData, MessageType } from "../types";
import WhatsAppChatBubble from "../components/WhatsAppChatBubble";
import { Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useQuery } from "@tanstack/react-query";
import client from "../api/client";
import apolloClient from "../apollo/client";
import { GET_MASTER_DATA } from "../graphql/queries";
import { useNavigate } from "react-router";
import ContactSelectOption from "../components/ContactSelectOption";

const NewMessage: React.FC = () => {
  const [body, setBody] = useState<string>('')
  const [file, setFile] = useState<FileType>({} as FileType);
  const [form] = Form.useForm();
  const templateId = Form.useWatch('MessageTemplateId', form);
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['masterData'],
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_MASTER_DATA })
      const { templates, groups }: MasterData = data;
      return { templates, groups };
    },
  })

  const { templates, groups } = data ?? { templates: [], groups: [] };

  useEffect(() => {
    if (!templateId) return setBody('');
    const m = templates.find((t) => t.id === templateId)
    setBody(m?.body ?? '');
  }, [templateId, templates]);

  function resetForm() {
    form.resetFields();
    setBody('');
    setFile({} as FileType);
  }

  function sendMessage(values: MessageType) {
    if (!values) return;

    console.log(values);

    const { groups = [], contacts = [] } = values;
    let templateName = '';

    if (!groups.length && !contacts.length) {
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

    if (templateId) {
      type = 'template';
      templateName = templates?.find((t) => t.id === templateId)?.name as string;
    }

    const payload = {
      ...values,
      type,
      message: body,
      caption: body,
      file,
      templateName
    };

    client.post('whatsapp/bulk-send', payload)
      .then(res => {
        // message.success(res.data.message);
        const modal = Modal.info({
          title: 'Success',
          width: 600,
          onCancel: () => resetForm(),
          content: (
            <Result
              status="success"
              title={res.data.message}
              subTitle="Please refer to the log for more details."
              extra={[
                <Button
                  type="primary"
                  key="send"
                  onClick={() => {
                    modal.destroy()
                    resetForm()
                  }}
                >
                  Send Another Message
                </Button>,

                <Button
                  key="log"
                  onClick={() => {
                    modal.destroy();
                    navigate('/logs')
                  }}
                >
                  View Log
                </Button>,
              ]}
            />
          ),
          centered: true,
          closable: true,
          footer: null,
        });
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
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

          <Form.Item name="MessageTemplateId" label="Message Template">
            <Select
              placeholder="None"
              allowClear
              options={templates.map((t) => ({ label: t.name, value: t.id }))}
            >
            </Select>
          </Form.Item>

          {!templateId && <Form.Item label="Body">
            <TextArea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Message body"
              autoSize={{ minRows: 3, maxRows: 10 }}
              maxLength={4096}
              showCount
            />
          </Form.Item>}

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
            name="contacts"
            label="Contacts"
          >
            <ContactSelectOption onChange={(value: number[]) => {
              form.setFieldsValue({ contacts: value });
            }} />
          </Form.Item>

          {!templateId && <Form.Item name="file" label="File" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              maxCount={1}
              name="file"
              listType="picture"
              action={client.defaults.baseURL + '/file'}
              accept="image/*, application/*"
              withCredentials
              onChange={({ file }) => {
                if (file.status === 'done') {
                  setFile(file.response.file);
                }
              }}
              onRemove={(file) => {
                client.post('/file/delete', { path: file.response.file.path })
                setFile({} as FileType);
              }}
            >
              <Button icon={<UploadOutlined />}>Select file</Button>
            </Upload>
          </Form.Item>}

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