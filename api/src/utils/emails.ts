import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async ({
  to,
  subject,
  text = "",
  html = "",
}: SendEmailParams): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Gmail App Password if using Gmail
      },
      tls: {
        rejectUnauthorized: false, // dev only
      },
    });

    await transporter.sendMail({
      from: `"MoneyNow Wealth" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (err: any) {
    console.error("Email sending error:", err.message);
  }
};
