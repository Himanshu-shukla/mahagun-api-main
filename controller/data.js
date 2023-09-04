import { projectsList } from "../data/projects.js";
import { ticketTypesArr } from "../data/ticketType.js";
import Customizations from "../models/customizations.js";
import Properties from "../models/properties.js";
import PropertyInfos from "../models/propertyinfos.js";

const GetAllProjectsList = async (req, res) => {
  try {
    return res.status(200).json({ projects: projectsList });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetAllTicketTypes = async (req, res) => {
  try {
    return res.status(200).json({ types: ticketTypesArr });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetBookletByPropertyId = async (req, res) => {
  const { propertyId } = req.body;

  try {
    const property = await Properties.findById(propertyId)
      .select("projectName propertyType tower")
      .lean();
    if (!property) return res.status(400).json("Property details not found");

    return res.status(200).json({
      data: await Customizations.find({
        property: property.projectName,
        bhk: property.propertyType,
        tower: { $in: property.tower },
      }).lean(),
    });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetPropertyInfo = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ properties: await PropertyInfos.find({ active: true }).lean() });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

export {
  GetAllProjectsList,
  GetAllTicketTypes,
  GetBookletByPropertyId,
  GetPropertyInfo,
};

// var params = {
//   Bucket: "mahagun-booklet",
// };

// const data = await s3Client.listObjectsV2(params).promise();

// let signedUrls = [];

// data.Contents.forEach((d) =>
//   signedUrls.push(`https://booklet.mahagunindia.com/${d.Key}`)
// );
