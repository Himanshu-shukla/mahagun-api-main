const getTicketStatusMatchQuery = async (status) => {
  if (status.toLowerCase() === "open") return { status: { $ne: "CLOSED" } };

  return { status: { $eq: "CLOSED" } };
};

const getAdminTicketStatusMatchQuery = async (status) => {
  if (status.toLowerCase() === "unassigned")
    return { status: { $eq: "UNASSIGNED" } };

  if (status.toLowerCase() === "closed") return { status: { $eq: "CLOSED" } };

  return { status: { $eq: "ASSIGNED" } };
};

export { getTicketStatusMatchQuery, getAdminTicketStatusMatchQuery };
