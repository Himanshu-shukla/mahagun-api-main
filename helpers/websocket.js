import jwt from "jsonwebtoken";
import config from "config";
import Notifications from "../models/notifications.js";

const WsAuthorization = async (token) => {
  if (!token) return {};

  return jwt.verify(token, config.get("jwtSecret"));
};

const GetTypeBasedQuery = async (type, id) => {
  if (type) return [{ adminId: id }, { audience: "admin" }];

  return [{ customerId: id }, { audience: "customer" }];
};

const ConditionBasedWsData = async (msg, role, _id, features) => {
  switch (msg) {
    //for notification count
    case "nc":
      return await getNotificationCount(role, _id, features);
    // last notification
    case "ln":
      return await getLatestNotification(role, _id, features);
    default:
      return null;
  }
};

async function getNotificationCount(role, _id, features) {
  const orQuery = await GetTypeBasedQuery(role, _id);

  let query = {
    $or: orQuery,
    isUnread: true,
  };

  if (role) query = { ...query, category: { $in: features } };

  return await Notifications.countDocuments(query);
}

async function getLatestNotification(role, _id, features) {
  const orQuery = await GetTypeBasedQuery(role, _id);

  let query = {
    $or: orQuery,
    isUnread: true,
  };

  if (role) query = { ...query, category: { $in: features } };

  return await Notifications.findOne(query)
    .select("title actionName actionLink")
    .sort({ createdAt: -1 });
}

export { WsAuthorization, GetTypeBasedQuery, ConditionBasedWsData };
