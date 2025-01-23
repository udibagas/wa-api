const wa = require("../services/wa.service");

exports.sendMessage = async (req, res) => {
  try {
    const {
      message,
      caption,
      phoneNumber,
      type,
      templateName,
      components = [],
    } = req.body;

    let response;

    switch (type) {
      case "text":
        response = await wa.messages.text({ body: message }, phoneNumber);
        break;

      case "image":
        const { id } = await wa.uploadImage(req.file.path);
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
        throw new Error("Invalid message type");
    }

    const body = await response.responseBodyToJSON();
    res.status(200).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
