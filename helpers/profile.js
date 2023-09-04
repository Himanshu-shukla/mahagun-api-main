import Customers from "../models/customers.js";
import PersonalInfoRequests from "../models/personalInfoRequests.js";
import { UpdateCustomerStatus } from "./customerStatus.js";
import BankingInfoRequests from "../models/bankingInfoRequests.js";
import PropertyInfoRequests from "../models/propertyInfoRequests.js";
import { SubmitProfileChangesForApproval } from "./approvals.js";

const SubmitPersonalInfoForApproval = async (
  customerId,
  name,
  pa,
  paCity,
  paState,
  paPincode,
  ca,
  caCity,
  caState,
  caPincode,
  photoIdProof,
  profession,
  alternatePhone,
  phone,
  email,
  dob
) => {
  await PersonalInfoRequests.create({
    customerId,
    email,
    phone,
    name,
    alternatePhone,
    pa,
    paCity,
    paState,
    paPincode,
    ca,
    caCity,
    caState,
    caPincode,
    photoIdProof,
    profession,
    dob,
  });

  SubmitProfileChangesForApproval(customerId, "PERSONAL");

  return UpdateCustomerStatus(customerId, "UNDER_REVIEW");
};

const CheckForInfoDuplicacy = async (
  customerId,
  email,
  phone,
  alternatePhone,
  res
) => {
  const customerIdQuery = { $ne: customerId };

  const emailCount = await Customers.countDocuments({
    email,
    _id: customerIdQuery,
  });
  if (emailCount > 0)
    return res
      .status(400)
      .json("Email address already in use on different account");

  const phoneCount = await Customers.countDocuments({
    phone,
    _id: customerIdQuery,
  });
  if (phoneCount > 0)
    return res
      .status(400)
      .json("Phone number already in use on different account");

  const altPhoneCount = await Customers.countDocuments({
    alternatePhone,
    _id: customerIdQuery,
  });
  if (altPhoneCount > 0)
    return res
      .status(400)
      .json("Alternate phone number already in use on different account");

  return false;
};

const SubmitBankingInfoForApproval = async (
  customerId,
  accountNumber,
  accountName,
  ifsc,
  accountType,
  upiId,
  gstNumber,
  companyAddress
) => {
  await BankingInfoRequests.create({
    customerId,
    accountNumber,
    accountName,
    ifsc,
    accountType,
    upiId,
    gstNumber,
    companyAddress,
  });

  SubmitProfileChangesForApproval(customerId, "BANK");

  return UpdateCustomerStatus(customerId, "UNDER_REVIEW");
};

const SubmitPropertyInfoForApproval = async (
  customerId,
  projectName,
  propertyCode,
  tower,
  towerCode,
  wingUnitNo,
  propertyType,
  purchaseDate
) => {
  await PropertyInfoRequests.create({
    customerId,
    projectName,
    propertyCode,
    tower,
    towerCode,
    wingUnitNo,
    propertyType,
    purchaseDate,
  });

  SubmitProfileChangesForApproval(customerId, "PROPERTY");

  return UpdateCustomerStatus(customerId, "UNDER_REVIEW");
};

export {
  SubmitPersonalInfoForApproval,
  CheckForInfoDuplicacy,
  SubmitBankingInfoForApproval,
  SubmitPropertyInfoForApproval,
};
