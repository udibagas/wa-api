import React from "react";
import "../css/WhatsAppChatBubble.css";

type WhatsAppChatBubbleProps = {
  sender: string;
  message: string;
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

const WhatsAppChatBubble: React.FC<WhatsAppChatBubbleProps> = ({ sender, message }) => {
  return (
    <div style={{ background: "url('http://forums.crackberry.com/attachments/blackberry-10-wallpapers-f308/137432d1361639896t-z10-wallpaper-set-z10-music.jpg')" }}>
      <div className="speech-wrapper">
        <div className="bubble">
          <div className="txt">
            <p className="name">{sender}</p>
            <p className="message" dangerouslySetInnerHTML={{ __html: format(message) }} />
            <span className="timestamp">now</span>
          </div>
          <div className="bubble-arrow"></div>
        </div>
        {/* <div className="bubble alt">
        <div className="txt">
          <p className="name alt">+353 87 1234 567<span> ~ John</span></p>
          <p className="message">Nice... this will work great for my new project.</p>
          <span className="timestamp">10:22 pm</span>
        </div>
        <div className="bubble-arrow alt"></div>
      </div> */}
      </div>
    </div>
  );
};

export default WhatsAppChatBubble;