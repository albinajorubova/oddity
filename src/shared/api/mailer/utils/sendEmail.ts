import { createTransporter } from "./createTransporter";

// import type
type ContactFormData = {
  name: string;
};

export async function sendEmail(data: ContactFormData): Promise<void> {
  if (!process.env.SMTP_CONTACT_FORM_EMAIL) {
    throw new Error("process.env.SMTP_CONTACT_FORM_EMAIL reuqired");
  }

  const recipientEmail = process.env.SMTP_CONTACT_FORM_EMAIL;
  const senderEmail = process.env.SMTP_USER || recipientEmail;
  const transporter = createTransporter();

  const htmlContent = `
    <h2>Новая заявка с сайта</h2>
    <p><strong>Имя:</strong> ${data.name}</p>
  `;

  await transporter.sendMail({
    from: `"Форма обратной связи" <${senderEmail}>`,
    to: recipientEmail,
    subject: `Новая заявка от ${data.name}`,
    html: htmlContent,
    text: `Новая заявка с сайта`,
  });
}
