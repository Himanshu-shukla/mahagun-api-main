import { SendCustomizationSubmitMailCustomer } from "../helpers/email.js";
import {
  SendCustomizationAcceptNotifCustomer,
  SendCustomizationNotifAdmin,
} from "../helpers/notifications.js";
import Customers from "../models/customers.js";
import CustomizationDetails from "../models/customizationDetails.js";
import Properties from "../models/properties.js";

const GetAdminCustomizations = async (req, res) => {
  const { customerId } = req.body;

  const { admin } = req;

  try {
    let matchQuery = { accepted: true };

    if (customerId) matchQuery = { ...matchQuery, customerId };

    if (admin.role === "sales") matchQuery = { ...matchQuery, upgrades: true };

    const customizations = await CustomizationDetails.aggregate([
      {
        $match: matchQuery,
      },
      {
        $group: {
          _id: { customerId: "$customerId", propertyId: "$propertyId" },
          updatedAt: { $first: "$updatedAt" },
          upgrades: { $first: "$upgrades" },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id.customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $lookup: {
          from: "properties",
          localField: "_id.propertyId",
          foreignField: "_id",
          as: "property",
        },
      },
      {
        $project: {
          name: { $first: "$customer.name" },
          email: { $first: "$customer.email" },
          phone: { $first: "$customer.phone" },
          projectName: { $first: "$property.projectName" },
          tower: { $first: "$property.tower" },
          upgrades: "$upgrades",
          customerId: "$_id.customerId",
          propertyId: "$_id.propertyId",
          createdAt: "$updatedAt",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return res.status(200).json({ customizations });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetSingleCustomerCustomizationsAdmin = async (req, res) => {
  const { customerId, propertyId } = req.body;

  try {
    const data = await CustomizationDetails.find({
      customerId,
      propertyId,
    }).lean();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const SaveCustomerCustomizations = async (req, res) => {
  const { customizationData, propertyId } = req.body;

  const { customer } = req;

  // customizationData: [{ categoryName, selectedName, selectedValues }];

  try {
    const customerData = await Customers.findById(customer._id)
      .select("phone")
      .lean();
    if (!customerData)
      return res.status(400).json("No customer found with give Id");

    const property = await Properties.findById(propertyId)
      .select("customerId")
      .lean();
    if (!property)
      return res.status(400).json("No property found with give Id");

    for (let customization of customizationData) {
      await CustomizationDetails.findOneAndUpdate(
        {
          customerId: customer._id,
          propertyId,
          categoryName: customization.categoryName,
        },
        {
          $set: {
            selectedName: customization.selectedName,
            selectedImages: customization.selectedImages,
            selectedValues: customization.selectedValues,
            upgrade: customization.upgrade,
            selectedTypes: customization.selectedTypes,
            updatedAt: Date.now(),
          },
        },
        {
          upsert: true,
        }
      );
    }

    return res
      .status(200)
      .json("Customization details saved. Accept customization to submit.");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const UpdateCustomerCustomizations = async (req, res) => {
  const {
    cid,
    categoryName,
    selectedName,
    selectedImages,
    selectedValues,
    upgrade,
    selectedTypes,
  } = req.body;

  try {
    await CustomizationDetails.findByIdAndUpdate(cid, {
      $set: {
        categoryName,
        selectedName,
        selectedImages,
        selectedValues,
        upgrade,
        selectedTypes,
        updatedAt: Date.now(),
      },
    });

    return res.status(200).json("Customization details updated.");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const ChangeAcceptedStatus = async (req, res) => {
  const { upgrades, propertyId } = req.body;

  const { customer } = req;

  try {
    await CustomizationDetails.updateMany(
      {
        customerId: customer._id,
        propertyId,
      },
      {
        $set: {
          upgrades,
          accepted: true,
        },
      }
    );

    SendCustomizationAcceptNotifCustomer(customer._id, propertyId);

    SendCustomizationNotifAdmin(customer._id, propertyId, upgrades);

    SendCustomizationSubmitMailCustomer(customer.email);

    //TODO: Mail to admin

    return res
      .status(200)
      .json("Customization details accepted. Our team will contact you soon");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetCustomerCustomizations = async (req, res) => {
  const { propertyId } = req.body;

  const { customer } = req;

  try {
    const data = await CustomizationDetails.find({
      propertyId,
      customerId: customer._id,
    }).lean();

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

export {
  GetAdminCustomizations,
  SaveCustomerCustomizations,
  UpdateCustomerCustomizations,
  GetCustomerCustomizations,
  GetSingleCustomerCustomizationsAdmin,
  ChangeAcceptedStatus,
};
