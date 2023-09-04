import {
  GenerateAndSendOTP,
  GenerateMatchQuery,
  GenerateSignedJwt,
  GetOrCreateCustomer,
  ResendOTP,
  UpdateCustomersVerification,
  VerifyOTP,
} from "../helpers/customer.js";
import { SendNewInquiryNotifAdmin } from "../helpers/notifications.js";
import Customers from "../models/customers.js";
import Inquires from "../models/inquires.js";

const SendLoginOTP = async (req, res) => {
  const { type, value } = req.body;

  try {
    const matchquery = await GenerateMatchQuery(type, value);

    const { customer, newCustomer } = await GetOrCreateCustomer(matchquery);

    const { code, msg } = await GenerateAndSendOTP(type, customer);

    return res.status(code).json({ status: msg, newCustomer });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const VerifyLoginOTP = async (req, res) => {
  const { type, otp, value } = req.body;

  try {
    const matchquery = await GenerateMatchQuery(type, value);

    const customer = await Customers.findOne({ ...matchquery, blocked: false })
      .select("name email profilePic phone verification loginSource")
      .lean();
    if (!customer) return res.status(400).json("Invalid Email/Phone number");

    const isValidOTP = await VerifyOTP(type, otp, customer);
    if (!isValidOTP) return res.status(400).json("OTP is invalid/expired");

    const token = await GenerateSignedJwt(customer);

    UpdateCustomersVerification(type, customer);

    return res.status(200).json({
      email: customer.email,
      phone: customer.phone,
      name: customer.name,
      profilePic: customer.profilePic,
      token,
    });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const RetryLoginOTP = async (req, res) => {
  const { type, value } = req.body;

  try {
    const matchquery = await GenerateMatchQuery(type, value);

    const customer = await Customers.findOne({ ...matchquery, blocked: false })
      .select("email phone")
      .lean();
    if (!customer) return res.status(200).json("Customer doesn't exist");

    const { code, msg } = await ResendOTP(type, customer);

    return res.status(code).json(msg);
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const SaveInquiryDetails = async (req, res) => {
  let { name, phone, email, project, message } = req.body;

  try {
    let inquiry = new Inquires({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      project: project.trim(),
      message: message.trim(),
    });
    await inquiry.save();

    SendNewInquiryNotifAdmin(phone, name, project, inquiry._id);

    return res
      .status(200)
      .json(
        "Your details are sent to our sales team. We will contact you as soon as possible"
      );
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

export { SendLoginOTP, VerifyLoginOTP, SaveInquiryDetails, RetryLoginOTP };
