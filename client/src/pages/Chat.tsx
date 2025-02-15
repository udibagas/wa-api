import React, { FormEvent, useState } from 'react';
import '../css/Chat.css';
import { Alert, Button, Empty, Flex, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { SendOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { markupTextToWhatsApp } from '../utils/markupTextToWhatsApp';
import ContactList from '../components/ContactList';
import { RecipientType } from '../types';
import ContactAvatar from '../components/ContactAvatar';

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
      <div style={{ borderRight: '1px solid #eee', paddingRight: '20px' }}>
        <Tooltip title='Send broadcast message' placement='right'>
          <Button
            variant='filled'
            color='default'
            icon={<WhatsAppOutlined />}
            size='large'>
          </Button>
        </Tooltip>
      </div>
      <ContactList onSelect={handleSelectContact} />

      <div className="chat-container">
        {contact ? <>
          <div className="chat-header">
            <ContactAvatar contact={contact} size={50} />
            <div>
              <h2 style={{ margin: 0 }}>{contact.name}</h2>
              <div>+{contact.phoneNumber}</div>
            </div>
          </div>

          <div className="chat-messages">
            <Alert
              message="Perhatian!"
              description="Message non template hanya akan terkirim jika penerima berinteraksi terlebih dahulu dalam waktu 24 jam."
              type="warning"
              showIcon
              style={{ marginBottom: 20 }}
              closable
            />

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