import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
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
      html:html,
    });

    console.log("Email sent successfully to", to);
  } catch (err) {
    console.error("Email sending error:", err);
  }
};
