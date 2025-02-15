import React, { FormEvent, useState } from 'react';
import '../css/Chat.css';
import { Button, Empty, Flex } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { SendOutlined } from '@ant-design/icons';
import { markupTextToWhatsApp } from '../utils/markupTextToWhatsApp';
import ContactList from '../components/ContactList';
import { RecipientType } from '../types';

type Message = { id: number; text: string; sender: string }

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello', sender: 'me' },
    { id: 2, text: 'Hi', sender: 'them' },
  ]);

  const [contact, setContact] = useState<RecipientType | null>(null);
  const [input, setInput] = useState('');

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { id: Date.now(), text: input, sender: 'me' }]);
      setInput('');
    }
  };

  function handleSelectContact(contact: RecipientType) {
    setContact(contact);
  }

  return (
    <Flex gap={20}>
      <ContactList onSelect={handleSelectContact} />

      <div className="chat-container">
        {contact ? <>
          <div className="chat-header">
            <h2>{contact.name}</h2>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.sender}`}
                dangerouslySetInnerHTML={{ __html: markupTextToWhatsApp(message.text) }}
              >
              </div>
            ))}
          </div>

          <form onSubmit={handleSend}>
            <Flex gap={10} style={{ padding: 10 }}>
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
        </> : <Flex align='center' justify='center' style={{ height: 'calc(100vh - 320px)' }}><Empty /></Flex>}
      </div>
    </Flex>
  );
};

export default Chat;