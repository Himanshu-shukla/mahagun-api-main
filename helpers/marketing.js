import Properties from "../models/properties.js";

const GetFilteredAudience = async (
  audience,
  propertytype,
  flattype,
  purchaseStartDate,
  purchaseEndDate,
  towers
) => {
  // audience - all, flat (propertyType), property (projectName, towers)

  let matchQuery = {};

  if (audience !== "all")
    matchQuery = {
      ...matchQuery,
      ...(await getAudienceQuery(audience, propertytype, flattype, towers)),
    };

  if (purchaseStartDate || purchaseEndDate)
    matchQuery = {
      ...matchQuery,
      ...(await getPurchaseDateQuery(purchaseStartDate, purchaseEndDate)),
    };

  const data = await Properties.aggregate([
    {
      $match: matchQuery,
    },
    {
      $group: {
        _id: "$customerId",
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "cus",
      },
    },
    {
      $project: {
        email: { $first: "$cus.email" },
        customerId: { $first: "$cus._id" },
        blocked: { $first: "$cus.blocked" },
      },
    },
  ]);

  if (data.length < 1) return { emails: [], customerIds: [] };

  let emails = [];

  let customerIds = [];

  data.forEach((d) => {
    if (d.blocked) return;

    emails.push(d.email);
    customerIds.push(d.customerId);
  });

  return { emails, customerIds };
};

async function getAudienceQuery(audience, propertytype, flattype, towers) {
  if (audience === "flat") return { propertyType: { $in: flattype } };

  return { projectName: { $in: propertytype }, tower: { $in: towers } };
}

async function getPurchaseDateQuery(purchaseStartDate, purchaseEndDate) {
  if (purchaseStartDate && purchaseEndDate)
    return {
      purchaseDate: { $gte: purchaseStartDate, $lte: purchaseEndDate },
    };

  if (purchaseStartDate && !purchaseEndDate)
    return {
      purchaseDate: { $gte: purchaseStartDate, $lte: Date.now() },
    };

  if (!purchaseStartDate && purchaseEndDate)
    return {
      purchaseDate: { $gte: Date.now(), $lte: purchaseEndDate },
    };

  return {};
}

export { GetFilteredAudience };
