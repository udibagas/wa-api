import React, { useMemo } from 'react';
import '../css/ContactItem.css';
import { Avatar, Flex } from 'antd';
import { RecipientType } from '../types';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

type PropType = {
  contact: RecipientType,
  onClick: (contact: RecipientType) => void
}

const ContactItem: React.FC<PropType> = ({ contact, onClick }) => {
  function handleClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.currentTarget.classList.add('active');
    e.currentTarget.parentElement?.querySelectorAll('.contact-item').forEach((el) => {
      if (el !== e.currentTarget) {
        el.classList.remove('active');
      }
    });

    onClick(contact);
  }

  return (
    <Flex
      gap={10}
      className="contact-item"
      onClick={handleClick}
    >
      {useMemo(() => <Avatar
        style={{ backgroundColor: getRandomColor(), verticalAlign: 'middle' }}
        size={45}
        gap={4}
      >
        {contact.name[0].toUpperCase()}
      </Avatar>, [contact.name])}

      <div className="contact-info">
        <Flex justify='space-between' align='center'>
          <h3>{contact.name}</h3>
          <div style={{ color: '#888' }}>10.01</div>
        </Flex>
        <p>Hey, how are you?</p>
      </div>
    </Flex>

  );
}

export default ContactItem;