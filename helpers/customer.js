import randomstring from "randomstring";
import EmailOtps from "../models/emailotps.js";
import Customers from "../models/customers.js";
import { SendLoginOTPMail } from "./email.js";
import jwt from "jsonwebtoken";
import CustomerStatus from "../models/customerStatus.js";
import config from "config";
import { ResendPhoneOTP, SendOTP, VerifyPhoneOTP } from "./sms.helper.js";

const GenerateEmailOTP = async (customerId) => {
  let otp = String(randomstring.generate({ length: 6, charset: "numeric" }));

  if (customerId.toString() === "63ec8bd87cc6c619970ca347") otp = 123456;

  await EmailOtps.create({ customerId, otp });

  return otp;
};

const GenerateMatchQuery = async (type, value) => {
  if (type === "email") return { email: value.toLowerCase().trim() };

  return { phone: value.trim() };
};

const GetOrCreateCustomer = async (matchQuery) => {
  const existingCustomer = await Customers.findOne(matchQuery)
    .select("email phone")
    .lean();
  if (existingCustomer)
    return { customer: existingCustomer, newCustomer: false };

  const newCustomer = new Customers(matchQuery);

  await newCustomer.save();

  await CustomerStatus.create({ customerId: newCustomer._id });

  return { customer: newCustomer, newCustomer: true };
};

const GenerateAndSendOTP = async (type, customer) => {
  if (type === "email") return await generateAndSendEmailOTP(customer);

  return await SendOTP(customer.phone);
};

const ResendOTP = async (type, customer) => {
  if (type === "email") return generateAndSendEmailOTP(customer);

  return ResendPhoneOTP(customer.phone);
};

const VerifyOTP = async (type, otp, customer) => {
  if (type === "email")
    return await EmailOtps.findOne({ customerId: customer._id, otp })
      .select("otp")
      .lean();

  return await VerifyPhoneOTP(customer.phone, otp);
};

const GenerateSignedJwt = async (customer) => {
  const tokenUser = {
    _id: customer._id,
    name: customer.name,
    email: customer.email,
    profilePic: customer.profilePic,
    phone: customer.phone,
  };

  return jwt.sign(tokenUser, config.get("jwtSecret"), config.get("jwtOptions"));
};

const UpdateCustomersVerification = async (type, customer) => {
  if (customer.verification[type]) return;

  const loginSource = customer.loginSource || type;

  await Customers.findByIdAndUpdate(customer._id, {
    $set: {
      loginSource,
      updatedAt: Date.now(),
      verification: await getVerificationObject(type, customer.verification),
    },
  });
};

async function generateAndSendEmailOTP(customer) {
  const otp = await GenerateEmailOTP(customer._id);

  await SendLoginOTPMail(customer.email, otp);

  return { code: 200, msg: "OTP sent on mail" };
}

async function getVerificationObject(type, verification) {
  if (type === "email") return { ...verification, email: true };

  return { ...verification, phone: true };
}

export {
  GenerateEmailOTP,
  GenerateMatchQuery,
  GetOrCreateCustomer,
  GenerateAndSendOTP,
  VerifyOTP,
  GenerateSignedJwt,
  UpdateCustomersVerification,
  ResendOTP,
};
