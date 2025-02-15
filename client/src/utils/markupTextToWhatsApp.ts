export function markupTextToWhatsApp(message: string) {
  if (!message) return "";

  return message
    .replace(/(?:\r\n|\r|\n)/g, "<br>")
    .replace(/(https?:\/\/[^\s]+)/g, "<a href='$1' target='_blank'>$1</a>")
    .replace(/\*(.*?)\*/g, "<b>$1</b>")
    .replace(/_(.*?)_/g, "<i>$1</i>")
    .replace(/~(.*?)~/g, "<s>$1</s>");
}
