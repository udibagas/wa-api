import React from "react";
import "../css/WhatsAppChatBubble.css";
import {
  AudioTwoTone,
  FileExcelTwoTone,
  FileImageTwoTone,
  FilePdfTwoTone,
  FilePptTwoTone,
  FileTextTwoTone,
  FileWordTwoTone,
  FileZipTwoTone,
  PlaySquareTwoTone
} from "@ant-design/icons";
import { FileType, FileTypes } from "../types";
import { markupTextToWhatsApp } from "../utils/markupTextToWhatsApp";

function readableSize(size: number): string {
  if (size === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(0)) + " " + sizes[i];
}

function FilePreview(file: FileType): React.ReactNode {
  const icons: Record<FileTypes, React.ReactNode> = {
    pdf: <FilePdfTwoTone />,
    doc: <FileWordTwoTone />,
    docx: <FileWordTwoTone />,
    xls: <FileExcelTwoTone />,
    xlsx: <FileExcelTwoTone />,
    ppt: <FilePptTwoTone />,
    pptx: <FilePptTwoTone />,
    txt: <FileTextTwoTone />,
    zip: <FileZipTwoTone />,
    rar: <FileZipTwoTone />,
    csv: <FileExcelTwoTone />,
    mp3: <AudioTwoTone />,
    mp4: <PlaySquareTwoTone />,
    jpg: <FileImageTwoTone />,
    jpeg: <FileImageTwoTone />,
    png: <FileImageTwoTone />,
    gif: <FileImageTwoTone />,
  }

  if (file.mimetype?.includes('image')) {
    return <img src={file.url} alt="" style={{ width: '100%' }} />;
  }

  const fileExtension = file.originalname?.split('.').pop() as FileTypes ?? 'txt';
  const fileIcon = icons[fileExtension];

  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '8px 4px',
      borderRadius: 4,
      marginBottom: 10,
      display: 'flex',
      gap: 5,
      alignItems: 'flex-start'
    }}>

      {React.cloneElement(fileIcon as React.ReactElement, { style: { fontSize: 35 } })}

      <div>
        <div style={{ fontWeight: 'bold', lineHeight: '1rem' }}> {file.originalname}</div>
        <small>{readableSize(file.size)} &bull; {file.originalname?.split('.').pop()?.toUpperCase()}</small>
      </div>
    </div>
  );
}

type WhatsAppChatBubbleProps = {
  message: string;
  file: FileType;
};

const WhatsAppChatBubble: React.FC<WhatsAppChatBubbleProps> = ({ message, file }) => {
  return (
    <div className="chat-container">
      <div className="speech-wrapper">
        <div className="bubble">
          <div className="txt">
            <p className="name">TPSM</p>

            {file?.url && <FilePreview {...file} />}

            <p className="message" dangerouslySetInnerHTML={{ __html: markupTextToWhatsApp(message) }} />
            <span className="timestamp">now</span>
          </div>
          <div className="bubble-arrow"></div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChatBubble;