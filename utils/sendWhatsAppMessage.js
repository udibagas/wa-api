const wa = require("../services/wa.service");

async function sendWhatsAppMessage({
  message,
  caption,
  phoneNumber,
  type,
  templateName,
  components = [],
  filePath,
  fileType,
}) {
  let response;

  switch (type) {
    case "text":
      response = await wa.messages.text({ body: message }, phoneNumber);
      break;

    case "image":
      const { id } = await wa.uploadImage(filePath, fileType);
      response = await wa.messages.image({ id, caption }, phoneNumber);
      break;

    case "template":
      const payload = {
        name: templateName,
        language: { code: "en_US" },
        components,
      };

      response = await wa.messages.template(payload, phoneNumber);
      break;

    default:
      const error = new Error("Invalid message type");
      error.status = 400;
      throw error;
  }

  const body = await response.responseBodyToJSON();
  return body;
}

module.exports = sendWhatsAppMessage;
