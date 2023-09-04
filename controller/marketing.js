import { SendMarketingMail } from "../helpers/email.js";
import { GetFilteredAudience } from "../helpers/marketing.js";
import { SendMarketingNotification } from "../helpers/notifications.js";
import Marketings from "../models/marketing.js";
import PropertyInfos from "../models/propertyinfos.js";

const GetAllMarketingCommunications = async (req, res) => {
  try {
    const marketing = await Marketings.find({}).lean().sort({ createdAt: -1 });

    return res.status(200).json({ marketing });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const SendMarketingCommunication = async (req, res) => {
  let {
    mediums,
    audience,
    mailData,
    propertytype,
    flattype,
    mailSubject,
    notifData,
    purchaseStartDate,
    purchaseEndDate,
    attachments,
    towerType,
  } = req.body;

  const { admin } = req;

  try {
    // mediums: { whatsapp, email, inapp }

    await Marketings.create({
      adminId: admin._id,
      mediums,
      audience,
      mailData,
      propertytype,
      flattype,
      mailSubject,
      notifData,
      purchaseStartDate,
      purchaseEndDate,
      towers: towerType,
    });

    startCommunication(
      mediums,
      audience,
      propertytype,
      flattype,
      purchaseStartDate,
      purchaseEndDate,
      mailSubject,
      mailData,
      notifData,
      attachments,
      towers
    );

    return res.status(200).json("Communcation started ...");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetTowerNamesByProperty = async (req, res) => {
  const { properties } = req.body;

  try {
    const towersTemp = await PropertyInfos.aggregate([
      {
        $match: { propertyName: { $in: properties }, active: true },
      },
      {
        $group: {
          _id: "$towerName.name",
        },
      },
    ]);

    let towers = [];

    towersTemp.forEach((data) => (towers = towers.concat(data._id)));

    return res.status(200).json(towers);
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

async function startCommunication(
  mediums,
  audience,
  propertytype,
  flattype,
  purchaseStartDate,
  purchaseEndDate,
  mailSubject,
  mailData,
  notifData,
  attachments,
  towers
) {
  const { emails, customerIds } = await GetFilteredAudience(
    audience,
    propertytype,
    flattype,
    purchaseStartDate,
    purchaseEndDate,
    towers
  );

  //Start email communication
  if (mediums.email)
    emails.forEach(async (email) => {
      await SendMarketingMail(
        // "pankaj@learnmall.in",
        email,
        mailSubject,
        mailData,
        attachments
      );
    });

  // Start In-app notification
  if (mediums.inapp)
    customerIds.forEach(
      async (customerId) =>
        await SendMarketingNotification(customerId, notifData, attachments)
    );
}

export {
  SendMarketingCommunication,
  GetAllMarketingCommunications,
  GetTowerNamesByProperty,
};
