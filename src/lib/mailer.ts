import "server-only"; // 标记只在服务端使用（客户端组件引入会报错）

import nodemailer from "nodemailer";
export const runtime = "nodejs"; // ✅ 必须强制 Node 环境

const config = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "", 10),
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

interface SendEmailOpt {
  subject?: string;
  text?: string;
}

export async function sendEmail(opt: SendEmailOpt = {}) {
  const { subject = "", text = "" } = opt;
  if (!subject) {
    console.error("subject required");
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Wont send email in dev env... ", subject, text);
    return;
  }

  const mailConfig = {
    from: `BLOGAI<${process.env.EMAIL_FROM}>`, // '昵称<发件人邮箱>'
    subject,
    to: process.env.NOTICE_EMAIL_TO,
    text,
  };
  const res = await transporter.sendMail(mailConfig);
  console.log("Message sent: %s", res.messageId);
  return res;
}
