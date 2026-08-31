import * as nodemailer from "nodemailer";

export const createTransporter = () => {
  if (!process.env.SMTP_HOST) {
    throw new Error("process.env.SMTP_HOST reuqired");
  }

  if (!process.env.SMTP_PORT) {
    throw new Error("process.env.SMTP_PORT reuqired");
  }

  if (!process.env.SMTP_USER) {
    throw new Error("process.env.SMTP_USER reuqired");
  }

  if (!process.env.SMTP_PASSWORD) {
    throw new Error("process.env.SMTP_PASSWORD reuqired");
  }

  const port = parseInt(process.env.SMTP_PORT || "", 10);
  const isSecure = process.env.SMTP_SECURE === "true";

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "",
    port: port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};
