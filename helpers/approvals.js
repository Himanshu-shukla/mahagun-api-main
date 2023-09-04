import Approvals from "../models/approvals.js";
import BankingInfoRequests from "../models/bankingInfoRequests.js";
import Bankings from "../models/bankings.js";
import Customers from "../models/customers.js";
import PersonalInfoRequests from "../models/personalInfoRequests.js";
import Properties from "../models/properties.js";
import PropertyInfoRequests from "../models/propertyInfoRequests.js";
import { SendAcceptNotifCustomer } from "./notifications.js";

const GetStatusFilter = async (status) => {
  if (status === "pending") return "PENDING";

  if (status === "approved") return "APPROVED";

  if (status === "rejected") return "REJECTED";

  return {
    $ne: "PENDING",
  };
};

const GenerateMID = async (customer) => {
  const customerNamePart = await genCustomerNamePart(customer.name);

  const propertyData = await Properties.findOne({ customerId: customer._id })
    .select("propertyCode towerCode wingUnitNo")
    .lean();

  return `M${propertyData.propertyCode}${propertyData.towerCode}${propertyData.wingUnitNo}${customerNamePart}`;
};

const SubmitProfileChangesForApproval = async (customerId, type) => {
  const customer = await getCustomerBasicData(customerId);

  return await Approvals.create({
    customerId,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    type,
  });
};

const GenerateAndUpdateMId = async (customer, admin) => {
  const mid = await GenerateMID(customer);

  await customer.updateOne({
    mid,
  });

  SendAcceptNotifCustomer(customer._id, admin.name, "New profile", mid);
};

const RejectApproval = async (customerId, rejectionNote) => {
  const approval = await Approvals.findOne({ customerId }).sort({
    createdAt: -1,
  });
  if (!approval) return "New profile";

  await approval.updateOne({
    status: "REJECTED",
    rejectionNote,
  });

  if (approval.type === "MID") return "New profile";

  return rejectCorrespondingRequest(approval.type, customerId);
};

const AcceptApproval = async (customerId, isMIDPresent) => {
  const approval = await Approvals.findOne({ customerId }).sort({
    createdAt: -1,
  });
  if (!approval) return;

  await approval.updateOne({
    status: "APPROVED",
  });

  return approveCorrespondingRequest(approval.type, customerId, isMIDPresent);
};

const GetOldAndNewData = async (customerId, type) => {
  const status = "UNDER_REVIEW";

  let oldData = {},
    newData = {};

  switch (type) {
    case "PERSONAL":
      oldData = await Customers.findById(customerId).lean();

      newData = await PersonalInfoRequests.findOne({
        customerId,
        status,
      }).lean();

      return { oldData, newData };

    case "BANK":
      oldData = await Bankings.findOne({ customerId }).lean();

      newData = await BankingInfoRequests.findOne({
        customerId,
        status,
      }).lean();

      return { oldData, newData };

    case "PROPERTY":
      oldData = await Properties.findOne({ customerId }).lean();

      newData = await PropertyInfoRequests.findOne({
        customerId,
        status,
      }).lean();

      return { oldData, newData };

    default:
      return { oldData, newData };
  }
};

async function genCustomerNamePart(customerName) {
  const nameParts = customerName.trim().split(" ");

  // e.g Pankaj => PANKAJ
  if (nameParts.length < 2) return nameParts[0].toUpperCase();

  // e.g Pankaj Yadav => PYADAV
  if (nameParts.length < 3)
    return (nameParts[0].charAt(0) + nameParts[1]).toUpperCase();

  // Pankaj Sultania Yadav => PSYADAV
  // Pankaj Sultania Double Yadav => PSYADAV
  return (
    nameParts[0].charAt(0) +
    nameParts[1].charAt(0) +
    nameParts[nameParts.length - 1]
  ).toUpperCase();
}

async function rejectCorrespondingRequest(type, customerId) {
  const status = "REJECTED";

  const filter = { customerId, status: "UNDER_REVIEW" };

  switch (type) {
    case "PERSONAL":
      await PersonalInfoRequests.findOneAndUpdate(filter, { $set: { status } });
      return "Update personal details";

    case "BANK":
      await BankingInfoRequests.findOneAndUpdate(filter, { $set: { status } });
      return "Update banking details";

    case "PROPERTY":
      await PropertyInfoRequests.findOneAndUpdate(filter, { $set: { status } });
      return "Update property details";

    default:
      return "New profile";
  }
}

async function approveCorrespondingRequest(type, customerId, isMIDPresent) {
  const status = "APPROVED";

  const filter = { customerId, status: "UNDER_REVIEW" };

  switch (type) {
    case "PERSONAL":
      const newPersonalInfo = await PersonalInfoRequests.findOneAndUpdate(
        filter,
        { $set: { status } },
        { new: true }
      );
      await updateApprovalDataInPersonalInfo(
        customerId,
        newPersonalInfo,
        isMIDPresent
      );
      return;

    case "BANK":
      const newBankInfo = await BankingInfoRequests.findOneAndUpdate(
        filter,
        { $set: { status } },
        { new: true }
      );
      await updateApprovalDataInBankInfo(customerId, newBankInfo, isMIDPresent);
      return;

    case "PROPERTY":
      const newPropertInfo = await PropertyInfoRequests.findOneAndUpdate(
        filter,
        { $set: { status } },
        { new: true }
      );
      await updateApprovalDataInPropertyInfo(
        customerId,
        newPropertInfo,
        isMIDPresent
      );
      return;

    default:
      return;
  }
}

async function updateApprovalDataInPersonalInfo(
  customerId,
  newPersonalInfo,
  isMIDPresent
) {
  if (!isMIDPresent) await createOrignalPersonalInfo(customerId);

  await Customers.findOneAndUpdate(
    { _id: customerId },
    {
      $set: {
        email: newPersonalInfo.email,
        name: newPersonalInfo.name,
        phone: newPersonalInfo.phone,
        alternatePhone: newPersonalInfo.alternatePhone,
        pa: newPersonalInfo.pa,
        paCity: newPersonalInfo.paCity,
        paState: newPersonalInfo.paState,
        paPincode: newPersonalInfo.paPincode,
        ca: newPersonalInfo.ca,
        caCity: newPersonalInfo.caCity,
        caState: newPersonalInfo.caState,
        caPincode: newPersonalInfo.caPincode,
        photoIdProof: newPersonalInfo.photoIdProof,
        profession: newPersonalInfo.profession,
        dob: newPersonalInfo.dob,
        updatedAt: Date.now(),
      },
    }
  );
}

async function updateApprovalDataInBankInfo(
  customerId,
  newBankInfo,
  isMIDPresent
) {
  if (!isMIDPresent) await createOrignalBankInfo(customerId);

  await Bankings.findOneAndUpdate(
    { customerId },
    {
      $set: {
        accountNumber: newBankInfo.accountNumber,
        accountName: newBankInfo.accountName,
        ifsc: newBankInfo.ifsc,
        accountType: newBankInfo.accountType,
        upiId: newBankInfo.upiId,
        gstNumber: newBankInfo.gstNumber,
        companyAddress: newBankInfo.companyAddress,
        updatedAt: Date.now(),
      },
    }
  );
}

async function updateApprovalDataInPropertyInfo(
  customerId,
  newPropertInfo,
  isMIDPresent
) {
  if (!isMIDPresent) await createOrignalPropertyInfo(customerId);

  await Properties.findOneAndUpdate(
    { customerId },
    {
      $set: {
        projectName: newPropertInfo.projectName,
        propertyCode: newPropertInfo.propertyCode,
        tower: newPropertInfo.tower,
        towerCode: newPropertInfo.towerCode,
        propertyType: newPropertInfo.propertyType,
        wingUnitNo: newPropertInfo.wingUnitNo,
        purchaseDate: newPropertInfo.purchaseDate,
        updatedAt: Date.now(),
      },
    }
  );
}

async function createOrignalPersonalInfo(customerId) {
  const customer = await Customers.findById(customerId).lean();

  return await PersonalInfoRequests.create({
    customerId,
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
    alternatePhone: customer.alternatePhone,
    pa: customer.pa,
    paCity: customer.paCity,
    paState: customer.paState,
    paPincode: customer.paPincode,
    ca: customer.ca,
    caCity: customer.caCity,
    caState: customer.caState,
    caPincode: customer.caPincode,
    photoIdProof: customer.photoIdProof,
    profession: customer.profession,
    dob: customer.dob,
    status: "ORIGNAL",
  });
}

async function createOrignalBankInfo(customerId) {
  const banking = await Bankings.findOne({ customerId }).lean();

  return await BankingInfoRequests.create({
    customerId,
    accountNumber: banking.accountNumber,
    accountName: banking.accountName,
    ifsc: banking.ifsc,
    accountType: banking.accountType,
    upiId: banking.upiId,
    gstNumber: banking.gstNumber,
    companyAddress: banking.companyAddress,
    status: "ORIGNAL",
  });
}

async function createOrignalPropertyInfo(customerId) {
  const property = await Properties.findOne({ customerId }).lean();

  return await PropertyInfoRequests.create({
    customerId,
    projectName: property.projectName,
    propertyCode: property.propertyCode,
    tower: property.tower,
    towerCode: property.towerCode,
    propertyType: property.propertyType,
    wingUnitNo: property.wingUnitNo,
    purchaseDate: property.purchaseDate,
    status: "ORIGNAL",
  });
}

async function getCustomerBasicData(customerId) {
  return await Customers.findById(customerId).select("name email phone").lean();
}

export {
  GenerateMID,
  GetStatusFilter,
  SubmitProfileChangesForApproval,
  RejectApproval,
  GenerateAndUpdateMId,
  AcceptApproval,
  GetOldAndNewData,
};
