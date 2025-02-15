import React, { useCallback } from 'react';
import { Flex } from 'antd';
import { RecipientType } from '../types';
import ContactAvatar from './ContactAvatar';
import '../css/ContactItem.css';

type PropType = {
  contact: RecipientType,
  onClick: (contact: RecipientType) => void
}

const ContactItem: React.FC<PropType> = ({ contact, onClick }) => {

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.currentTarget.classList.add('active');
    e.currentTarget.parentElement?.querySelectorAll('.contact-item').forEach((el) => {
      if (el !== e.currentTarget) {
        el.classList.remove('active');
      }
    });

    onClick(contact);
  }, [contact, onClick]);

  return (
    <Flex
      gap={10}
      className="contact-item"
      onClick={handleClick}
    >
      <ContactAvatar contact={contact} />

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