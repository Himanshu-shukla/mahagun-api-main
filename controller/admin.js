import bcrypt from "bcrypt";
import { GenerateAdminSignedJwt } from "../helpers/admins.js";
import Admins from "../models/admins.js";

const LoginWithPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admins.findOne({
      email: email.toLowerCase().trim(),
      blocked: false,
    })
      .select("password phone email name role features")
      .lean();
    if (!admin) return res.status(400).json("Username or password incorrect");

    const matched = bcrypt.compare(password.trim(), admin.password);
    if (!matched) return res.status(400).json("Username or password incorrect");

    const { adminDetails, token } = await GenerateAdminSignedJwt(admin);

    return res.status(200).json({ ...adminDetails, token });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetAllAdminList = async (req, res) => {
  const { admin } = req;

  try {
    return res.status(200).json({
      admins: await Admins.find({
        _id: { $ne: admin._id },
        features: { $in: "Tickets" },
        blocked: false,
      })
        .select("name")
        .lean(),
    });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const CreatePassowrdHash = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ hash: await bcrypt.hash(req.params.password, 10) });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

export { LoginWithPassword, GetAllAdminList, CreatePassowrdHash };
