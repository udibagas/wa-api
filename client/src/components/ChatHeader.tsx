import React from "react";
import { ContactType } from "../types";
import ContactAvatar from "./ContactAvatar";

const ChatHeader: React.FC<{ contact: ContactType }> = React.memo(({ contact }) => {
  return (
    <div className="chat-header">
      <ContactAvatar contact={contact} size={50} />
      <div>
        <h2 style={{ margin: 0 }}>{contact.name}</h2>
        <div>+{contact.phoneNumber}</div>
      </div>
    </div>
  )
})

export default ChatHeader;