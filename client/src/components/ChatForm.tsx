import { Button, Flex } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { SendOutlined, PlusOutlined } from "@ant-design/icons";

const ChatForm: React.FC<{ onSubmit: (text: string) => void }> = React.memo(({ onSubmit }) => {
  const [input, setInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(input);
    setInput('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap={10} style={{ padding: 10 }}>
        <Button
          icon={<PlusOutlined />}
          size='large'
          style={{ backgroundColor: '#075e54', color: 'white' }}
        >
        </Button>

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