import { Button, Dropdown, Flex, MenuProps, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import {
  SendOutlined,
  PlusOutlined,
  FileDoneOutlined,
  FileImageOutlined,
  FilePdfOutlined
} from "@ant-design/icons";
import client from "../api/client";
import { FileType } from "../types";

type ChatFormProps = {
  onSubmit: (text: string) => void,
  onUpload: (file: FileType | null) => void
}

const ChatForm: React.FC<ChatFormProps> = React.memo(({ onSubmit, onUpload }) => {
  const [input, setInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(input);
    setInput('');
  }

  const items: MenuProps['items'] = [
    {
      key: 'image', label: (
        <>
          <Upload
            maxCount={1}
            name="file"
            listType="picture"
            action={client.defaults.baseURL + '/upload'}
            accept="image/*"
            withCredentials
            onChange={({ file }) => {
              if (file.status === 'done') {
                onUpload(file.response.file);
              }
            }}
            onRemove={(file) => {
              client.post('/delete-file', { path: file.response.file.path })
              onUpload(null)
            }}
          >
            <FileImageOutlined style={{ marginRight: 10 }} />
            Image
          </Upload>
        </>
      )
    },
    {
      key: 'doc', label: (
        <>
          <FilePdfOutlined style={{ marginRight: 10 }} />
          Document
        </>
      )
    },
    {
      key: 'template', label: (
        <>
          <FileDoneOutlined style={{ marginRight: 10 }} />
          Template
        </>
      )
    },
  ]

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap={10} style={{ padding: 10 }}>
        <Dropdown menu={{ items }} placement="topLeft" arrow>
          <Button
            icon={<PlusOutlined />}
            size='large'
            style={{ backgroundColor: '#075e54', color: 'white' }}
          >
          </Button>
        </Dropdown>


        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1 }}
          autoSize={{ minRows: 1, maxRows: 4 }}
          size='large'
        />

        <Button
          htmlType='submit'
          icon={<SendOutlined />}
          iconPosition='end'
          size='large'
          style={{ backgroundColor: '#075e54', color: 'white' }}
        >
          SEND
        </Button>
      </Flex>
    </form>
  )
})

export default ChatForm;