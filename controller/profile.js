import {
  UpdateBankingInfoFillStatus,
  UpdatePersonalInfoFillStatus,
  UpdatePropertyInfoFillStatus,
} from "../helpers/customerStatus.js";
import {
  CheckForInfoDuplicacy,
  SubmitBankingInfoForApproval,
  SubmitPersonalInfoForApproval,
  SubmitPropertyInfoForApproval,
} from "../helpers/profile.js";
import Bankings from "../models/bankings.js";
import Customers from "../models/customers.js";
import CustomerStatus from "../models/customerStatus.js";
import AWS from "aws-sdk";
import config from "config";
import Properties from "../models/properties.js";
import { SendProfileReviewNotifAdmin } from "../helpers/notifications.js";

const GetCustomerProfileStatus = async (req, res) => {
  const { customer } = req;

  try {
    const statusData = await CustomerStatus.findOne({
      customerId: customer._id,
    })
      .select("-createdAt -updatedAt -customerId -_id -__v")
      .lean();
    if (!statusData)
      return res
        .status(400)
        .json("Unexpected error occured. Please contact support team");

    return res.status(200).json(statusData);
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetPersonalInfo = async (req, res) => {
  const { customer } = req;

  try {
    return res
      .status(200)
      .json(
        await Customers.findById(customer._id)
          .select(
            "name pa paCity paState paPincode ca caCity caState caPincode photoIdProof profession alternatePhone phone email dob mid"
          )
          .lean()
      );
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const SavePersonalInfo = async (req, res) => {
  const {
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
    dob,
  } = req.body;

  let { phone, email, alternatePhone } = req.body;

  const { customer } = req;

  try {
    const exisitingCustomer = await Customers.findById(customer._id)
      .select("status verification phone email")
      .lean();

    if (!exisitingCustomer)
      return res.status(400).json("No customer found with provided details");

    if (exisitingCustomer.status !== "DRAFT")
      return res
        .status(400)
        .json("Profile status should be DRAFT to update personal information");

    email = email.trim().toLowerCase();

    phone = phone.trim();

    alternatePhone = alternatePhone.trim();

    if (
      await CheckForInfoDuplicacy(
        customer._id,
        email,
        phone,
        alternatePhone,
        res
      )
    )
      return;

    if (exisitingCustomer.verification.phone) phone = exisitingCustomer.phone;

    if (exisitingCustomer.verification.email) email = exisitingCustomer.email;

    await Customers.findByIdAndUpdate(customer._id, {
      $set: {
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
        dob: new Date(dob),
      },
    });

    UpdatePersonalInfoFillStatus(customer._id, true);

    return res.status(200).json("Personal information updated successfully");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const UpdatePersonalInfo = async (req, res) => {
  const {
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
    dob,
  } = req.body;
  let { phone, email, alternatePhone } = req.body;

  const { customer } = req;

  try {
    const exisitingCustomer = await Customers.findById(customer._id)
      .select("status")
      .lean();

    if (!exisitingCustomer)
      return res.status(400).json("No customer found with provided details");

    if (exisitingCustomer.status === "UNDER_REVIEW")
      return res
        .status(400)
        .json("Can't update personal information when profile is UNDER_REVIEW");

    if (exisitingCustomer.status === "DRAFT")
      return res
        .status(400)
        .json("Can't update personal information when profile is in DRAFT");

    email = email.trim().toLowerCase();

    phone = phone.trim();

    alternatePhone = alternatePhone.trim();

    if (await CheckForInfoDuplicacy(customer._id, email, phone, alternatePhone))
      return;

    await SubmitPersonalInfoForApproval(
      customer._id,
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
      new Date(dob)
    );

    return res
      .status(200)
      .json("Personal information change request submitted successfully");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetBankingInfo = async (req, res) => {
  const { customer } = req;

  try {
    return res
      .status(200)
      .json(
        await Bankings.findOne({ customerId: customer._id })
          .select(
            "accountNumber accountName ifsc accountType upiId gstNumber companyAddress"
          )
          .lean()
      );
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const SaveBankingInfo = async (req, res) => {
  let {
    accountNumber,
    accountName,
    ifsc,
    accountType,
    upiId,
    gstNumber,
    companyAddress,
  } = req.body;

  const { customer } = req;

  try {
    const exisitingCustomer = await Customers.findById(customer._id)
      .select("status")
      .lean();

    if (!exisitingCustomer)
      return res.status(400).json("No customer found with provided details");

    if (exisitingCustomer.status !== "DRAFT")
      return res
        .status(400)
        .json("Profile status should be DRAFT to update banking information");

    if (gstNumber) gstNumber = gstNumber.toUpperCase();

    await Bankings.findOneAndUpdate(
      { customerId: customer._id },
      {
        $set: {
          accountNumber,
          accountName,
          ifsc: ifsc.toUpperCase(),
          accountType: accountType.toLowerCase(),
          upiId,
          gstNumber,
          companyAddress,
        },
      },
      {
        upsert: true,
      }
    );

    UpdateBankingInfoFillStatus(customer._id, true);

    return res.status(200).json("Banking information updated successfully");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const UpdateBankingInfo = async (req, res) => {
  const {
    accountNumber,
    accountName,
    ifsc,
    accountType,
    upiId,
    gstNumber,
    companyAddress,
  } = req.body;

  const { customer } = req;

  try {
    const exisitingCustomer = await Customers.findById(customer._id)
      .select("status")
      .lean();

    if (!exisitingCustomer)
      return res.status(400).json("No customer found with provided details");

    if (exisitingCustomer.status === "UNDER_REVIEW")
      return res
        .status(400)
        .json("Can't update banking information when profile is UNDER_REVIEW");

    if (exisitingCustomer.status === "DRAFT")
      return res
        .status(400)
        .json("Can't update banking information when profile is in DRAFT");

    await SubmitBankingInfoForApproval(
      customer._id,
      accountNumber,
      accountName,
      ifsc,
      accountType,
      upiId,
      gstNumber,
      companyAddress
    );

    return res
      .status(200)
      .json("Banking information change request submitted successfully");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetPropertyInfo = async (req, res) => {
  const { customer } = req;

  try {
    return res.status(200).json({
      properties: await Properties.find({ customerId: customer._id })
        .select(
          "projectName propertyCode tower towerCode wingUnitNo propertyType purchaseDate"
        )
        .lean(),
    });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const SavePropertyInfo = async (req, res) => {
  const {
    projectName,
    propertyCode,
    tower,
    towerCode,
    wingUnitNo,
    propertyType,
    purchaseDate,
  } = req.body;

  const { customer } = req;

  try {
    const exisitingCustomer = await Customers.findById(customer._id)
      .select("status name email phone")
      .lean();

    if (!exisitingCustomer)
      return res.status(400).json("No customer found with provided details");

    if (exisitingCustomer.status !== "DRAFT")
      return res
        .status(400)
        .json("Profile status should be DRAFT to update property information");

    await Properties.findOneAndUpdate(
      { customerId: customer._id },
      {
        $set: {
          projectName,
          propertyCode,
          tower,
          towerCode,
          wingUnitNo,
          propertyType,
          purchaseDate,
        },
      },
      {
        upsert: true,
      }
    );

    UpdatePropertyInfoFillStatus(true, exisitingCustomer);

    SendProfileReviewNotifAdmin(customer._id, exisitingCustomer.name);

    // TODO: send mail to admin
    // TODO: send push notification to admin

    return res
      .status(200)
      .json(
        "Property information updated successfully. Profile will be live once approved by admin."
      );
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const UpdatePropertyInfo = async (req, res) => {
  const {
    projectName,
    propertyCode,
    tower,
    towerCode,
    wingUnitNo,
    propertyType,
    purchaseDate,
  } = req.body;

  const { customer } = req;

  try {
    const exisitingCustomer = await Customers.findById(customer._id)
      .select("status")
      .lean();

    if (!exisitingCustomer)
      return res.status(400).json("No customer found with provided details");

    if (exisitingCustomer.status === "UNDER_REVIEW")
      return res
        .status(400)
        .json("Can't update property information when profile is UNDER_REVIEW");

    if (exisitingCustomer.status === "DRAFT")
      return res
        .status(400)
        .json("Can't update property information when profile is in DRAFT");

    await SubmitPropertyInfoForApproval(
      customer._id,
      projectName,
      propertyCode,
      tower,
      towerCode,
      wingUnitNo,
      propertyType,
      purchaseDate
    );

    return res
      .status(200)
      .json("Property information change request submitted successfully");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetAwsUploadToken = async (req, res) => {
  try {
    AWS.config.region = config.aws.region2;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: config.aws.identityPoolId,
    });

    AWS.config.credentials.get(function () {
      const data = {
        accessKeyId: AWS.config.credentials.accessKeyId,
        secretAccessKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken,
      };

      res.status(200).json({ data });
    });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetCustomerDetailsAdmin = async (req, res) => {
  const { customerId } = req.params;

  try {
    const personalInfo = await Customers.findById(customerId)
      .select(
        "email phone verification createdAt name alternatePhone pa paCity paState paPincode ca caCity caState caPincode photoIdProof profession profilePic dob"
      )
      .lean();

    const bankingInfo = await Bankings.findOne({ customerId })
      .select(
        "accountNumber accountName ifsc accountType upiId gstNumber companyAddress"
      )
      .lean();

    const propertyInfo = await Properties.findOne({ customerId })
      .select(
        "projectName propertyCode tower towerCode wingUnitNo propertyType purchaseDate"
      )
      .lean();

    return res.status(200).json({ personalInfo, bankingInfo, propertyInfo });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

export {
  GetCustomerProfileStatus,
  GetPersonalInfo,
  SavePersonalInfo,
  UpdatePersonalInfo,
  GetBankingInfo,
  SaveBankingInfo,
  UpdateBankingInfo,
  GetPropertyInfo,
  SavePropertyInfo,
  UpdatePropertyInfo,
  GetAwsUploadToken,
  GetCustomerDetailsAdmin,
};
