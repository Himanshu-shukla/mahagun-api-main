import {
  AcceptApproval,
  GenerateAndUpdateMId,
  GetOldAndNewData,
  GetStatusFilter,
  RejectApproval,
} from "../helpers/approvals.js";
import {
  SendChangesAcceptNotifCustomer,
  SendRejectionNotifCustomer,
} from "../helpers/notifications.js";
import Approvals from "../models/approvals.js";
import Customers from "../models/customers.js";
import CustomerStatus from "../models/customerStatus.js";

const GetAdminApprovalsByStatus = async (req, res) => {
  const { status, customerId } = req.body;

  try {
    let filter = {
      status: await GetStatusFilter(status),
    };

    if (customerId) filter = { ...filter, customerId };

    const approvals = await Approvals.find(filter)
      .select("email phone name status customerId type createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ approvals });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const RejectCustomerProfile = async (req, res) => {
  const { customerId, rejectionNote } = req.body;

  const { admin } = req;

  try {
    const customer = await Customers.findOne({
      _id: customerId,
      status: "UNDER_REVIEW",
    });
    if (!customer)
      return res
        .status(400)
        .json("No profile in-review with provided Customer Id");

    await customer.updateOne({ status: "DRAFT" });

    await CustomerStatus.findOneAndUpdate(
      { customerId },
      {
        $set: {
          status: "DRAFT",
        },
      }
    );

    const subCategory = await RejectApproval();

    //TODO: Mail to customer
    //TODO: Push notification to customer

    SendRejectionNotifCustomer(
      customerId,
      rejectionNote,
      admin.name,
      subCategory
    );

    return res
      .status(200)
      .json("Customer profile rejected & sent back to draft");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const ApproveCustomerProfile = async (req, res) => {
  const { customerId } = req.params;

  const { admin } = req;

  try {
    const customer = await Customers.findOne({
      _id: customerId,
      status: "UNDER_REVIEW",
    });
    if (!customer)
      return res
        .status(400)
        .json("No profile in-review with provided Customer Id");

    const isMIDPresent = customer.mid;

    if (!isMIDPresent) await GenerateAndUpdateMId(customer, admin);

    await CustomerStatus.findOneAndUpdate(
      { customerId },
      {
        $set: {
          status: "APPROVED",
        },
      }
    );

    await customer.updateOne({
      status: "APPROVED",
    });

    AcceptApproval(customerId, isMIDPresent);

    if (isMIDPresent)
      SendChangesAcceptNotifCustomer(
        customer._id,
        admin.name,
        "Profile changes"
      );

    //TODO: Mail to customer
    //TODO: Push notification to customer

    return res
      .status(200)
      .json(
        `Customer profile${isMIDPresent ? " changes" : ""} approved ${
          isMIDPresent ? "" : "& MID is generated"
        }`
      );
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetChangeDataDetails = async (req, res) => {
  const { customerId, type } = req.body;

  try {
    const customer = await Customers.findOne({
      _id: customerId,
      status: "UNDER_REVIEW",
    });
    if (!customer)
      return res
        .status(400)
        .json("No profile in-review with provided Customer Id");

    const { oldData, newData } = await GetOldAndNewData(customerId, type);

    return res.status(200).json({ oldData, newData });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

export {
  GetAdminApprovalsByStatus,
  RejectCustomerProfile,
  ApproveCustomerProfile,
  GetChangeDataDetails,
};
