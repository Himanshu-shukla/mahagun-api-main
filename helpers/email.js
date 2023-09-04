import { createTransport } from "nodemailer";
import AWS from "aws-sdk";
import config from "config";
import { GetMarketingAttachmentUrl } from "./cdn.js";

AWS.config.update(config.get("aws"));
var transporter = createTransport({
  SES: new AWS.SES({
    apiVersion: "2010-12-01",
    region: config.aws.region2,
  }),
  sendingRate: 90,
});

const SendLoginOTPMail = async (email, otp) => {
  var mailOptions = {
    from: "Mahagun Customers OTP <noreply@mahagunindia.com>",
    to: email,
    subject: "OTP for Logging In",
    html:
      "<p> Hello " +
      ", <br/><br/>Your One Time Password(OTP) for Login/Register is <strong>" +
      otp +
      "</strong><br/><br/><p><b>#The OTP is valid for a period of one-hour.<br/><br/><br/>*Kindly do not reply to this email as it is sent from an unmonitored mailbox.<br/>**For any queries, do write to us at info@mahagunindia.com.</b><br/><br/><br/>Thanks<br/>Team Mahagun Developers</p>",
  };

  return await transporter.sendMail(mailOptions);
};

const ResendLoginOTPMail = async (email, otp) => {
  var mailOptions = {
    from: "Mahagun Customers OTP <noreply@mahagunindia.com>",
    to: email,
    subject: "New OTP for Logging In",
    html:
      "<p> Hello " +
      ", <br/><br/>Your One Time Password(OTP) for Login/Register is <strong>" +
      otp +
      "</strong><br/><br/><p><b>#The OTP is valid for a period of one-hour.<br/><br/><br/>*Kindly do not reply to this email as it is sent from an unmonitored mailbox.<br/>**For any queries, do write to us at info@mahagunindia.com.</b><br/><br/><br/>Thanks<br/>Team Mahagun Developers</p>",
  };

  return await transporter.sendMail(mailOptions);
};

const SendMarketingMail = async (email, subject, html, mailAttachments) => {
  let attachments = [];

  for (const a of mailAttachments) {
    attachments.push({
      filename: a.name,
      href: await GetMarketingAttachmentUrl(a.url),
      contentType: a.fileType,
    });
  }

  const mailOptions = {
    from: "Mahagun India <noreply@mahagunindia.com>",
    to: email,
    subject,
    html,
    attachments,
  };

  return await transporter.sendMail(mailOptions);
};

const SendCustomizationSubmitMailCustomer = async (email) => {
  const mailOptions = {
    from: "Mahagun India <noreply@mahagunindia.com>",
    to: email,
    subject: "Customization request submitted",
    html: "Thanks for your customization request, we shall review & update you within 3-5 Working days.<br/>**For any queries, do write to us at info@mahagunindia.com.</b><br/><br/><br/>Thanks<br/>Team Mahagun Developers</p>",
  };

  return await transporter.sendMail(mailOptions);
};

export {
  SendLoginOTPMail,
  ResendLoginOTPMail,
  SendMarketingMail,
  SendCustomizationSubmitMailCustomer,
};
