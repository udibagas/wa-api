import React from "react";
import "../css/WhatsAppChatBubble.css";

type WhatsAppChatBubbleProps = {
  sender: string;
  message: string;
  imageUrl?: string;
};

function format(message: string) {
  if (!message) return "";

  return message
    .replace(/(?:\r\n|\r|\n)/g, "<br>")
    .replace(/(https?:\/\/[^\s]+)/g, "<a href='$1' target='_blank'>$1</a>")
    .replace(/\*(.*?)\*/g, "<b>$1</b>")
    .replace(/_(.*?)_/g, "<i>$1</i>")
    .replace(/~(.*?)~/g, "<s>$1</s>");
}

const WhatsAppChatBubble: React.FC<WhatsAppChatBubbleProps> = ({ sender, message, imageUrl }) => {
  return (
    <div className="chat-container">
      <div className="speech-wrapper">
        <div className="bubble">
          <div className="txt">
            <p className="name">{sender}</p>
            {imageUrl && <img src={imageUrl} alt="" style={{ width: '100%' }} />}
            <p className="message" dangerouslySetInnerHTML={{ __html: format(message) }} />
            <span className="timestamp">now</span>
          </div>
          <div className="bubble-arrow"></div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChatBubble;