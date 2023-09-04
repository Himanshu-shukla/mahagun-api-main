import Inquires from "../models/inquires.js";

const GetAllAdminInquiries = async (req, res) => {
  const { _id } = req.body;

  try {
    let matchQuery = {};

    if (_id) matchQuery = { ...matchQuery, _id };

    const inquiries = await Inquires.find(matchQuery)
      .lean()
      .sort({ createdAt: -1 });

    return res.status(200).json({ inquiries });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

export { GetAllAdminInquiries };
