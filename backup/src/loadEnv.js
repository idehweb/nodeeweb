import { config } from "dotenv";

if (!process.env.ENV_LOADER || process.env.ENV_LOADER === "File") {
  config({ path: "./.env.local" });
}

// decode password
process.env.SFTP_PASSWORD = decodeURIComponent(process.env.SFTP_PASSWORD);
process.env.MONGO_URL = decodeURIComponent(process.env.MONGO_URL);
