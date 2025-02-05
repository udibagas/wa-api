import React from "react";
import "../css/WhatsAppChatBubble.css";
import { FileType } from "../pages/NewMessage";
import { FileTextTwoTone } from "@ant-design/icons";

type WhatsAppChatBubbleProps = {
  sender: string;
  message: string;
  file: FileType;
};

function readableSize(size: number): string {
  if (size === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(0)) + " " + sizes[i];
}

function format(message: string) {
  if (!message) return "";

  return message
    .replace(/(?:\r\n|\r|\n)/g, "<br>")
    .replace(/(https?:\/\/[^\s]+)/g, "<a href='$1' target='_blank'>$1</a>")
    .replace(/\*(.*?)\*/g, "<b>$1</b>")
    .replace(/_(.*?)_/g, "<i>$1</i>")
    .replace(/~(.*?)~/g, "<s>$1</s>");
}

function FilePreview(file: FileType): React.ReactNode {
  if (file.mimetype?.includes('image')) {
    return <img src={file.url} alt="" style={{ width: '100%' }} />;
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '8px 4px',
      borderRadius: 4,
      marginBottom: 20,
      display: 'flex',
      gap: 5
    }}>
      <FileTextTwoTone style={{ fontSize: 50 }} />
      <div>
        <div style={{ fontWeight: 'bold', lineHeight: '1rem', overflow: 'clip' }}> {file.originalname}</div>
        <small>{readableSize(file.size)} &bull; {file.originalname?.split('.').pop()}</small>
      </div>
    </div>
  );
}

const WhatsAppChatBubble: React.FC<WhatsAppChatBubbleProps> = ({ sender, message, file }) => {
  return (
    <div className="chat-container">
      <div className="speech-wrapper">
        <div className="bubble">
          <div className="txt">
            <p className="name">{sender}</p>

            {file.url && <FilePreview {...file} />}

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