import jwt from "jsonwebtoken";
import config from "config";

const GenerateAdminSignedJwt = async (admin) => {
  const adminDetails = {
    name: admin.name,
    email: admin.email,
    role: admin.role,
    _id: admin._id,
    phone: admin.phone,
    features: admin.features,
  };

  return {
    adminDetails,
    token: jwt.sign(
      adminDetails,
      config.get("jwtSecret"),
      config.get("jwtOptions")
    ),
  };
};

export { GenerateAdminSignedJwt };
