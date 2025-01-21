import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import { configDotenv } from "dotenv";
import WhatsApp from "whatsapp";
configDotenv();

const {
  WA_BASE_URL,
  CLOUD_API_VERSION,
  WA_PHONE_NUMBER_ID,
  CLOUD_API_ACCESS_TOKEN,
} = process.env;

const wa = new WhatsApp();

wa.uploadImage = async (imagePath) => {
  const data = new FormData();
  data.append("messaging_product", "whatsapp");
  data.append("file", fs.createReadStream(imagePath), {
    contentType: "image/png",
  });

  data.append("type", "image/png");

  const response = await axios({
    url: `https://${WA_BASE_URL}/${CLOUD_API_VERSION}/${WA_PHONE_NUMBER_ID}/media`,
    method: "post",
    headers: { Authorization: `Bearer ${CLOUD_API_ACCESS_TOKEN}` },
    data: data,
  });

  return response.data;
};

export default wa;
