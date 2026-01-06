import React, { useEffect, useRef, useState } from 'react';
import { Button, Empty, Flex, message, Tooltip } from 'antd';
import ContactList from '../components/ContactList';
import { FileType, Message, ContactType } from '../types';
import '../css/Chat.css';
import { createItem, getItems } from '../api/client';
import { useQuery } from '@tanstack/react-query';
import ChatForm from '../components/ChatForm';
import { CommentOutlined, NotificationOutlined, TeamOutlined } from '@ant-design/icons';
import ChatMessage from '../components/ChatMessage';
import ChatHeader from '../components/ChatHeader';

const EmptyMessage: React.FC = () => (
  <Flex align='center' justify='center' style={{ height: 'calc(100vh - 320px)' }}>
    <Empty description="Select chat to display conversation" />
  </Flex>
);

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contact, setContact] = useState<ContactType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<FileType | null>(null);

  const handleSend = async (text: string) => {
    if (text.trim()) {
      try {
        const message = await createItem<Message>('/chats', {
          type: 'text',
          to: contact?.phoneNumber as string,
          message: text
        })

        setMessages([...messages, message]);
      } catch (error) {
        message.error(`Failed to send message: ${(error as Error).message}`);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { data } = useQuery({
    queryKey: ['chats', { phoneNumber: contact?.phoneNumber }],
    queryFn: async () => {
      if (contact) {
        const data = await getItems<Message[]>(`/chats`, { phoneNumber: contact.phoneNumber });
        return data;
      }
      return [];
    },
    enabled: !!contact,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  async function handleSelectContact(contact: ContactType) {
    setContact(contact);
  }

  return (
    <Flex gap={20}>
      <Flex vertical gap={15} style={{ borderRight: '1px solid #eee', paddingRight: '20px' }}>
        <Tooltip title='Chat' placement='right'>
          <Button
            color='default'
            icon={<CommentOutlined />}
            size='large'>
          </Button>
        </Tooltip>
        <Tooltip title='Send Broadcast Message' placement='right'>
          <Button
            color='default'
            icon={<NotificationOutlined />}
            size='large'>
          </Button>
        </Tooltip>
        <Tooltip title='Contact' placement='right'>
          <Button
            color='default'
            icon={<TeamOutlined />}
            size='large'>
          </Button>
        </Tooltip>
      </Flex>

      <ContactList onSelect={handleSelectContact} />

      <div className="chat-container">
        {contact ? <>
          <ChatHeader contact={contact} />

          <div className="chat-messages">

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            <img src={file?.url} alt="" style={{ width: 200 }} />

            <div ref={messagesEndRef} />
          </div>

          <ChatForm onSubmit={handleSend} onUpload={(file) => setFile(file)} />
        </> : <EmptyMessage />}
      </div>
    </Flex>
  );
};

export default Chat;