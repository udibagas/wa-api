import React from "react";
import { ContactType } from "../types";
import { Avatar } from "antd";

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ContactAvatar: React.FC<{ contact: ContactType, size?: number }> = React.memo(({ contact, size = 45 }) => {
  return (
    <Avatar
      style={{
        backgroundColor: getRandomColor(),
        verticalAlign: 'middle',
        border: '2px solid white'
      }}
      size={size}
      gap={4}
    >
      {contact.name[0].toUpperCase()}
    </Avatar>
  )
});

export default ContactAvatar;
