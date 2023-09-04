import { PeriodBasedFilteration } from "../helpers/notifications.js";
import Notifications from "../models/notifications.js";

const GetAllAdminNotifications = async (req, res) => {
  const { period } = req.params;

  const { admin } = req;

  try {
    const getCreateAtFilter = await PeriodBasedFilteration(period);

    const notifications = await Notifications.find({
      category: { $in: admin.features },
      $or: [{ adminId: admin._id }, { audience: "admin" }],
      createdAt: getCreateAtFilter,
    })
      .select(
        "title category subCategory actionName actionLink isUnread createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetAllCustomerNotifications = async (req, res) => {
  const { period } = req.params;

  const { customer } = req;

  try {
    const getCreateAtFilter = await PeriodBasedFilteration(period);

    const notifications = await Notifications.find({
      $or: [{ customerId: customer._id }, { audience: "customer" }],
      createdAt: getCreateAtFilter,
    })

      .select(
        "title category subCategory actionName actionLinkApp isUnread createdAt attachments"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const MarkSingleNotificationRead = async (req, res) => {
  const { id } = req.params;

  try {
    await Notifications.findByIdAndUpdate(id, {
      $set: {
        isUnread: false,
        readAt: Date.now(),
      },
    }).lean();

    return res.status(200).json("Notification marked as read");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

export {
  GetAllAdminNotifications,
  MarkSingleNotificationRead,
  GetAllCustomerNotifications,
};
